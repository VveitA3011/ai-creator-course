// Máy chủ giả lập Supabase để chạy thử: phần auth tối giản + PostgREST tối giản trên PGlite có RLS thật.
import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";
import { PGlite } from "@electric-sql/pglite";

const PORT = Number(process.env.PORT ?? 54321);
const db = new PGlite();
await db.exec(`
create schema auth;
create table auth.users (id uuid primary key, email text unique, password text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create role anon nologin; create role authenticated nologin;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
`);
await db.exec(fs.readFileSync(process.argv[2], "utf8"));

let queue = Promise.resolve();
const serial = (fn) => (queue = queue.then(fn, fn));

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (sub, email) => {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  return `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub, email, role: "authenticated", aud: "authenticated", exp })}.sig`;
};
const subOf = (req) => {
  const t = (req.headers.authorization ?? "").replace(/^Bearer /, "");
  try {
    const p = JSON.parse(Buffer.from(t.split(".")[1] ?? "", "base64url").toString());
    return p.sub ?? null;
  } catch {
    return null;
  }
};
const userObj = (u) => ({ id: u.id, aud: "authenticated", role: "authenticated", email: u.email, app_metadata: { provider: "email" }, user_metadata: {}, created_at: new Date().toISOString() });
const session = (u) => ({ access_token: jwt(u.id, u.email), token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: "r-" + u.id, user: userObj(u) });

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Expose-Headers": "*", ...headers });
  res.end(body === undefined ? "" : JSON.stringify(body));
};
const readBody = (req) =>
  new Promise((r) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => r(d ? JSON.parse(d) : null));
  });

const pgErr = (res, e) => {
  const code = e.code ?? "";
  const status = code === "23505" ? 409 : code === "42501" ? 403 : 400;
  send(res, status, { code, message: e.message, details: null, hint: null });
};

const ident = (s) => {
  if (!/^[a-z_][a-z0-9_]*$/.test(s)) throw Object.assign(new Error("bad identifier " + s), { code: "PGRST" });
  return `"${s}"`;
};

async function asRole(sub, fn) {
  return serial(async () => {
    await db.exec("begin");
    try {
      await db.query("select set_config('request.jwt.claim.sub', $1, true)", [sub ?? ""]);
      await db.exec(`set local role ${sub ? "authenticated" : "anon"}`);
      const r = await fn();
      await db.exec("commit");
      return r;
    } catch (e) {
      await db.exec("rollback");
      throw e;
    }
  });
}

function where(params, vals) {
  const parts = [];
  for (const [k, v] of params) {
    if (["select", "order", "limit", "on_conflict", "columns"].includes(k)) continue;
    const m = /^(eq|neq|is)\.(.*)$/.exec(v);
    if (!m) continue;
    if (m[1] === "is") parts.push(`${ident(k)} is ${m[2] === "null" ? "null" : m[2] === "true" ? "true" : "false"}`);
    else {
      vals.push(m[2]);
      parts.push(`${ident(k)}::text ${m[1] === "eq" ? "=" : "<>"} $${vals.length}`);
    }
  }
  return parts.length ? " where " + parts.join(" and ") : "";
}

async function rest(req, res, url) {
  const table = ident(url.pathname.split("/")[3]);
  const p = url.searchParams;
  const sub = subOf(req);
  const prefer = req.headers.prefer ?? "";
  const wantObj = (req.headers.accept ?? "").includes("vnd.pgrst.object");
  const returning = prefer.includes("return=representation") ? " returning *" : "";
  const vals = [];
  try {
    let rows;
    if (req.method === "GET" || req.method === "HEAD") {
      const sel = (p.get("select") ?? "*").split(",").map((c) => (c.trim() === "*" ? "*" : ident(c.trim()))).join(", ");
      let sql = `select ${sel} from public.${table}${where(p, vals)}`;
      if (p.get("order"))
        sql += " order by " + p.get("order").split(",").map((o) => { const [c, d] = o.split("."); return `${ident(c)} ${d === "desc" ? "desc" : "asc"}`; }).join(", ");
      if (p.get("limit")) sql += ` limit ${Number(p.get("limit"))}`;
      rows = (await asRole(sub, () => db.query(sql, vals))).rows;
    } else if (req.method === "POST") {
      const body = await readBody(req);
      const list = Array.isArray(body) ? body : [body];
      const cols = Object.keys(list[0]);
      const tuples = list.map((o) => "(" + cols.map((c) => { vals.push(typeof o[c] === "object" && o[c] !== null ? JSON.stringify(o[c]) : o[c]); return `$${vals.length}`; }).join(", ") + ")");
      let sql = `insert into public.${table} (${cols.map(ident).join(", ")}) values ${tuples.join(", ")}`;
      if (prefer.includes("resolution=merge-duplicates")) {
        const oc = p.get("on_conflict") ?? "id";
        sql += ` on conflict (${ident(oc)}) do update set ` + cols.filter((c) => c !== oc).map((c) => `${ident(c)} = excluded.${ident(c)}`).join(", ");
      }
      rows = (await asRole(sub, () => db.query(sql + returning, vals))).rows;
      if (!returning) return send(res, 201);
    } else if (req.method === "PATCH") {
      const body = await readBody(req);
      const sets = Object.keys(body).map((c) => { vals.push(typeof body[c] === "object" && body[c] !== null ? JSON.stringify(body[c]) : body[c]); return `${ident(c)} = $${vals.length}`; });
      rows = (await asRole(sub, () => db.query(`update public.${table} set ${sets.join(", ")}${where(p, vals)}${returning}`, vals))).rows;
      if (!returning) return send(res, 204);
    } else if (req.method === "DELETE") {
      rows = (await asRole(sub, () => db.query(`delete from public.${table}${where(p, vals)}${returning}`, vals))).rows;
      if (!returning) return send(res, 204);
    }
    if (wantObj) {
      if (rows.length !== 1) return send(res, 406, { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned" });
      return send(res, 200, rows[0]);
    }
    send(res, 200, rows, { "Content-Range": `0-${Math.max(rows.length - 1, 0)}/*` });
  } catch (e) {
    pgErr(res, e);
  }
}

async function auth(req, res, url) {
  const path = url.pathname.replace("/auth/v1", "");
  if (path === "/signup" && req.method === "POST") {
    const { email, password } = await readBody(req);
    if (!password || password.length < 6) return send(res, 422, { code: 422, error_code: "weak_password", msg: "Password should be at least 6 characters." });
    const exists = await serial(() => db.query("select 1 from auth.users where email = $1", [email]));
    if (exists.rows.length) return send(res, 422, { code: 422, error_code: "user_already_exists", msg: "User already registered" });
    const u = { id: crypto.randomUUID(), email };
    await serial(() => db.query("insert into auth.users (id, email, password) values ($1, $2, $3)", [u.id, email, password]));
    return send(res, 200, session(u));
  }
  if (path === "/token") {
    const body = await readBody(req);
    if (url.searchParams.get("grant_type") === "password") {
      const r = await serial(() => db.query("select id, email from auth.users where email = $1 and password = $2", [body.email, body.password]));
      if (!r.rows.length) return send(res, 400, { error: "invalid_grant", error_description: "Invalid login credentials", error_code: "invalid_credentials", msg: "Invalid login credentials" });
      return send(res, 200, session(r.rows[0]));
    }
    const id = String(body.refresh_token ?? "").replace(/^r-/, "");
    const r = await serial(() => db.query("select id, email from auth.users where id::text = $1", [id]));
    return r.rows.length ? send(res, 200, session(r.rows[0])) : send(res, 400, { error: "invalid_grant", msg: "Invalid Refresh Token" });
  }
  if (path === "/user") {
    const sub = subOf(req);
    const r = await serial(() => db.query("select id, email from auth.users where id::text = $1", [sub ?? ""]));
    if (!r.rows.length) return send(res, 401, { msg: "invalid JWT" });
    if (req.method === "PUT") {
      const body = await readBody(req);
      if (body.password) await serial(() => db.query("update auth.users set password = $1 where id = $2", [body.password, sub]));
    }
    return send(res, 200, userObj(r.rows[0]));
  }
  if (path === "/logout") return send(res, 204);
  if (path === "/recover") return send(res, 200, {});
  send(res, 404, { msg: "not found " + path });
}

http
  .createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS" });
      return res.end();
    }
    const url = new URL(req.url, "http://x");
    try {
      if (url.pathname.startsWith("/rest/v1/")) return await rest(req, res, url);
      if (url.pathname.startsWith("/auth/v1/")) return await auth(req, res, url);
      if (url.pathname === "/__debug/state") {
        const r = await serial(() => db.query("select u.email, s.data from public.user_state s join auth.users u on u.id = s.user_id"));
        return send(res, 200, r.rows);
      }
      send(res, 404, { msg: "not found" });
    } catch (e) {
      send(res, 500, { msg: String(e) });
    }
  })
  .listen(PORT, () => console.log("mock supabase on " + PORT));

import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";
const db = new PGlite();
const q = async (sql, label) => { try { const r = await db.query(sql); return r.rows; } catch (e) { return "ERR " + e.message; } };
// Mô phỏng phần auth của Supabase
await db.exec(`
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create role anon nologin; create role authenticated nologin;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
`);
await db.exec(fs.readFileSync(process.argv[2], "utf8"));
await db.exec(fs.readFileSync(process.argv[2], "utf8")); // chạy lại lần hai phải vẫn an toàn
const A = "11111111-1111-1111-1111-111111111111", B = "22222222-2222-2222-2222-222222222222";
await db.exec(`insert into auth.users values ('${A}'), ('${B}');`);
const as = async (role, uid, sql) => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid ?? ""}', false); set role ${role};`);
  const r = await q(sql); await db.exec("reset role;"); return r;
};
const out = {};
out.profilesAutoCreated = await q("select count(*)::int n from public.profiles");
out.A_setHandle = await as("authenticated", A, "update public.profiles set handle='minh-anh', display_name='Minh Anh' where id='"+A+"' returning handle");
out.A_updateB_blocked = await as("authenticated", A, "update public.profiles set display_name='hack' where id='"+B+"' returning id");
out.badHandle = await as("authenticated", A, "update public.profiles set handle='Có Dấu' where id='"+A+"'");
out.anon_seesProfiles = await as("anon", null, "select handle from public.profiles");
out.A_state = await as("authenticated", A, `insert into public.user_state (user_id, data) values ('${A}', '{"aic-progress-v1":"{}"}') returning user_id`);
out.A_state_upsert = await as("authenticated", A, `insert into public.user_state (user_id, data) values ('${A}', '{"x":1}') on conflict (user_id) do update set data = excluded.data returning data`);
out.B_reads_A_state = await as("authenticated", B, "select * from public.user_state");
out.B_writes_as_A = await as("authenticated", B, `insert into public.user_state (user_id, data) values ('${A}', '{}')`);
out.anon_state = await as("anon", null, "select * from public.user_state");
out.A_sub = await as("authenticated", A, `insert into public.submissions (user_id, module_slug, url) values ('${A}', 'tuan-1', 'https://x') returning module_slug`);
out.B_sees_subs = await as("authenticated", B, "select * from public.submissions");
out.A_items = await as("authenticated", A, `insert into public.portfolio_items (user_id, title, is_public) values ('${A}', 'Công khai', true), ('${A}', 'Riêng', false) returning title`);
out.anon_items = await as("anon", null, "select title from public.portfolio_items");
out.B_items = await as("authenticated", B, "select title from public.portfolio_items");
out.B_edit_A_item = await as("authenticated", B, "update public.portfolio_items set title='hack' returning id");
out.anon_insert_item = await as("anon", null, `insert into public.portfolio_items (user_id, title) values ('${A}', 'x')`);
out.A_badCategory = await as("authenticated", A, `insert into public.portfolio_items (user_id, title, category) values ('${A}', 'x', 'other')`);
out.updatedAtTouch = await as("authenticated", A, "update public.portfolio_items set title='Riêng 2' where title='Riêng' returning updated_at > created_at as touched");
console.log(JSON.stringify(out, null, 1));

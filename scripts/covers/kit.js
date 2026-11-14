import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export const C = {
  coral: "#e2574f",
  coralDeep: "#8f2b31",
  cream: "#f7e8a4",
  violet: "#9277ee",
  orange: "#f08a3c",
  ink: "#2a0d11",
  wine: "#4b1b22",
  deep: "#3a1319",
  white: "#fff5f3",
  gold: "#e8c27a",
  red: "#d9534f",
  blue: "#3b4a7a",
};

/* ---------- vật liệu ---------- */
export const plastic = (color, o = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25, ...o });
export const matte = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...o });
export const metal = (color = C.gold, o = {}) => new THREE.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.28, ...o });
export const glass = (color = "#ffffff", o = {}) =>
  new THREE.MeshPhysicalMaterial({ color, transmission: 0.92, thickness: 0.6, roughness: 0.06, ior: 1.45, ...o });
export const glow = (color, intensity = 1.6) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity });
export const screen = (map) => new THREE.MeshBasicMaterial({ map, toneMapped: false });

/* ---------- tiện ích ---------- */
export function put(parent, obj, p = [0, 0, 0], r = [0, 0, 0], s = 1) {
  obj.position.set(...p);
  obj.rotation.set(...r);
  if (typeof s === "number") obj.scale.setScalar(s);
  else obj.scale.set(...s);
  obj.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  parent.add(obj);
  return obj;
}
export const group = () => new THREE.Group();
export const mesh = (geo, mat) => new THREE.Mesh(geo, mat);
export const rbox = (w, h, d, r, mat) => mesh(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2, h / 2, d / 2)), mat);
export const sphere = (r, mat) => mesh(new THREE.SphereGeometry(r, 48, 32), mat);
export const cyl = (rt, rb, h, mat, seg = 48) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
export const torus = (r, t, mat, arc = Math.PI * 2) => mesh(new THREE.TorusGeometry(r, t, 24, 96, arc), mat);
export const capsule = (r, len, mat) => mesh(new THREE.CapsuleGeometry(r, len, 12, 32), mat);
export const cone = (r, h, mat, seg = 48) => mesh(new THREE.ConeGeometry(r, h, seg), mat);

/* ---------- vẽ 2D làm texture (không có chữ) ---------- */
export function tex(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
const grad = (ctx, h, a, b) => {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  return g;
};

/* Một cảnh nhỏ khung dọc: trời, mặt đất, chủ thể */
export function miniScene(kind = "person", o = {}) {
  const sky = o.sky ?? ["#f3b15c", "#c9523f"];
  return tex(360, 640, (ctx, w, h) => {
    ctx.fillStyle = grad(ctx, h, sky[0], sky[1]);
    ctx.fillRect(0, 0, w, h);
    const ground = o.ground ?? 0.7;
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, h * ground, w, h);
    const s = o.scale ?? 1;
    const cx = w * (o.x ?? 0.5);
    const base = h * ground;
    ctx.fillStyle = o.fg ?? "#2a0d11";
    if (kind === "person") {
      ctx.beginPath();
      ctx.arc(cx, base - 190 * s, 30 * s, 0, 7);
      ctx.fill();
      rr(ctx, cx - 42 * s, base - 150 * s, 84 * s, 150 * s, [40 * s, 40 * s, 10 * s, 10 * s]);
      ctx.fill();
    } else if (kind === "cat") {
      ctx.beginPath();
      ctx.ellipse(cx, base - 45 * s, 60 * s, 48 * s, 0, 0, 7);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + 30 * s, base - 100 * s, 34 * s, 0, 7);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 8 * s, base - 120 * s);
      ctx.lineTo(cx + 14 * s, base - 150 * s);
      ctx.lineTo(cx + 30 * s, base - 128 * s);
      ctx.moveTo(cx + 36 * s, base - 128 * s);
      ctx.lineTo(cx + 52 * s, base - 150 * s);
      ctx.lineTo(cx + 58 * s, base - 120 * s);
      ctx.fill();
    } else if (kind === "bottle") {
      rr(ctx, cx - 60 * s, base - 170 * s, 120 * s, 170 * s, 18 * s);
      ctx.fill();
      ctx.fillRect(cx - 18 * s, base - 215 * s, 36 * s, 50 * s);
      ctx.fillStyle = "rgba(255,240,200,0.55)";
      ctx.fillRect(cx - 40 * s, base - 150 * s, 10 * s, 120 * s);
    } else if (kind === "window") {
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      rr(ctx, w * 0.18, h * 0.12, w * 0.64, h * 0.5, 14);
      ctx.fill();
      ctx.fillStyle = o.fg ?? "#2a0d11";
      ctx.fillRect(w * 0.49, h * 0.12, 8, h * 0.5);
      ctx.fillRect(w * 0.18, h * 0.36, w * 0.64, 8);
    }
    if (o.rain) {
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 3;
      for (let i = 0; i < 60; i++) {
        const x = (i * 97) % w,
          y = (i * 211) % h;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 8, y + 28);
        ctx.stroke();
      }
    }
    if (o.snow) {
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      for (let i = 0; i < 70; i++) {
        ctx.beginPath();
        ctx.arc((i * 89) % w, (i * 173) % h, 4 + (i % 3) * 2, 0, 7);
        ctx.fill();
      }
    }
    if (o.sub) {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      rr(ctx, w * 0.16, h * 0.62, w * 0.68, 46, 12);
      ctx.fill();
      ctx.fillStyle = "#fff5f3";
      rr(ctx, w * 0.22, h * 0.62 + 18, w * 0.4, 10, 5);
      ctx.fill();
      ctx.fillStyle = "#f7e8a4";
      rr(ctx, w * 0.64, h * 0.62 + 18, w * 0.14, 10, 5);
      ctx.fill();
    }
  });
}

/* Giao diện điện thoại trừu tượng */
export function phoneUI(kind = "play") {
  return tex(360, 720, (ctx, w, h) => {
    if (kind === "ad") {
      ctx.fillStyle = grad(ctx, h, "#ffb36b", "#e2574f");
    } else if (kind === "grid") {
      ctx.fillStyle = "#1c080b";
    } else {
      ctx.fillStyle = grad(ctx, h, "#9b82f3", "#3a1319");
    }
    ctx.fillRect(0, 0, w, h);
    if (kind === "grid") {
      const cols = ["#e2574f", "#f7e8a4", "#9277ee", "#f08a3c", "#e2574f", "#9277ee"];
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = cols[i];
        rr(ctx, 24 + (i % 2) * 166, 80 + Math.floor(i / 2) * 200, 146, 184, 16);
        ctx.fill();
      }
      return;
    }
    if (kind === "ad") {
      ctx.fillStyle = "#2a0d11";
      rr(ctx, 120, 190, 120, 200, 22);
      ctx.fill();
      ctx.fillRect(160, 150, 40, 50);
    } else {
      ctx.fillStyle = "rgba(255,245,243,0.9)";
      ctx.beginPath();
      ctx.moveTo(150, 290);
      ctx.lineTo(150, 410);
      ctx.lineTo(250, 350);
      ctx.fill();
    }
    // thanh phụ đề
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    rr(ctx, 50, 470, 260, 44, 12);
    ctx.fill();
    ctx.fillStyle = "#fff5f3";
    rr(ctx, 74, 488, 150, 9, 5);
    ctx.fill();
    // cột nút phải
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i === 0 ? "#e2574f" : "rgba(255,255,255,0.75)";
      ctx.beginPath();
      ctx.arc(318, 420 + i * 56, 16, 0, 7);
      ctx.fill();
    }
    // thanh tiến trình
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(0, h - 10, w, 4);
    ctx.fillStyle = "#f7e8a4";
    ctx.fillRect(0, h - 10, w * 0.45, 4);
  });
}

/* Trang giấy có dòng (không chữ) */
export function pageTex(lines = 9, o = {}) {
  return tex(400, 520, (ctx, w, h) => {
    ctx.fillStyle = o.bg ?? "#fff5f3";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = o.head ?? "#e2574f";
    rr(ctx, 40, 44, 200, 22, 11);
    ctx.fill();
    for (let i = 0; i < lines; i++) {
      ctx.fillStyle = i % 4 === 3 ? "#9277ee" : "rgba(42,13,17,0.28)";
      rr(ctx, 40, 100 + i * 40, (w - 80) * (0.55 + ((i * 37) % 40) / 100), 12, 6);
      ctx.fill();
    }
  });
}

/* Timeline dựng phim */
export function timelineTex() {
  return tex(1000, 360, (ctx, w, h) => {
    ctx.fillStyle = "#1c080b";
    ctx.fillRect(0, 0, w, h);
    const rows = [
      [["#e2574f", 20, 180], ["#f7e8a4", 210, 160], ["#9277ee", 380, 240], ["#e2574f", 630, 150], ["#f08a3c", 790, 190]],
      [["#9277ee", 20, 420], ["#9277ee", 450, 520]],
      [["#f7e8a4", 60, 120], ["#f7e8a4", 330, 90], ["#f7e8a4", 700, 140]],
    ];
    rows.forEach((r, i) =>
      r.forEach(([c, x, len]) => {
        ctx.fillStyle = c;
        rr(ctx, x, 40 + i * 100, len, 70, 12);
        ctx.fill();
      }),
    );
    ctx.fillStyle = "#fff5f3";
    ctx.fillRect(520, 10, 5, h - 20);
  });
}

/* Bảng điều khiển số liệu */
export function dashTex() {
  return tex(800, 500, (ctx, w, h) => {
    ctx.fillStyle = "#1c080b";
    ctx.fillRect(0, 0, w, h);
    const cols = ["#e2574f", "#f7e8a4", "#9277ee"];
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = cols[i % 3];
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(110 + (i % 3) * 140, 110 + Math.floor(i / 3) * 140, 46, -1.6, -1.6 + 1.2 + i * 0.7);
      ctx.stroke();
    }
    ctx.strokeStyle = "#f7e8a4";
    ctx.lineWidth = 8;
    ctx.beginPath();
    [[480, 400], [540, 340], [600, 360], [660, 260], [740, 150]].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
    ctx.fillStyle = "#e2574f";
    ctx.beginPath();
    ctx.moveTo(470, 60);
    ctx.lineTo(760, 60);
    ctx.lineTo(650, 130);
    ctx.lineTo(580, 130);
    ctx.fill();
  });
}

/* Lịch */
export function calTex() {
  return tex(500, 500, (ctx, w, h) => {
    ctx.fillStyle = "#fff5f3";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#e2574f";
    ctx.fillRect(0, 0, w, 90);
    const hl = ["#f7e8a4", "#9277ee", "#f08a3c", "#e2574f"];
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 7; c++) {
        ctx.fillStyle = r < 4 ? hl[r] : "rgba(42,13,17,0.12)";
        if (r < 4) ctx.globalAlpha = 0.85;
        rr(ctx, 26 + c * 66, 120 + r * 74, 52, 56, 10);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
  });
}

/* Bánh xe màu */
export function wheelTex(shift = 0) {
  return tex(512, 512, (ctx, w, h) => {
    const g = ctx.createConicGradient(shift, w / 2, h / 2);
    ["#e2574f", "#f08a3c", "#f7e8a4", "#9fd38a", "#6fb3d9", "#9277ee", "#e2574f"].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 4, 0, 7);
    ctx.fill();
    const r = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    r.addColorStop(0, "rgba(255,255,255,0.95)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = r;
    ctx.fill();
  });
}

/* ---------- đạo cụ 3D ---------- */
export function phone(ui = phoneUI()) {
  const g = group();
  put(g, rbox(1.62, 3.24, 0.18, 0.2, plastic("#1c080b")));
  put(g, mesh(new THREE.PlaneGeometry(1.46, 3.06), screen(ui)), [0, 0, 0.095]);
  return g;
}

export function frame9(map, w = 1.1, border = C.white) {
  const g = group();
  const h = (w * 16) / 9;
  put(g, rbox(w + 0.12, h + 0.12, 0.06, 0.08, plastic(border)));
  put(g, mesh(new THREE.PlaneGeometry(w, h), screen(map)), [0, 0, 0.032]);
  return g;
}

export function panel(map, w, h, border = "#1c080b") {
  const g = group();
  put(g, rbox(w + 0.14, h + 0.14, 0.1, 0.1, plastic(border)));
  put(g, mesh(new THREE.PlaneGeometry(w, h), screen(map)), [0, 0, 0.052]);
  return g;
}

export function bottle(liquid = C.orange, o = {}) {
  const g = group();
  put(g, rbox(1.3, 1.6, 0.8, 0.18, glass("#ffe9d6", { thickness: 1.2 })), [0, 0.8, 0]);
  put(g, rbox(1.05, 1.15, 0.58, 0.12, plastic(liquid, { transmission: 0.35, roughness: 0.15 })), [0, 0.7, 0]);
  put(g, cyl(0.17, 0.17, 0.25, metal(o.cap ?? C.gold)), [0, 1.72, 0]);
  put(g, rbox(0.55, 0.6, 0.55, 0.12, metal(o.cap ?? C.gold)), [0, 2.12, 0]);
  return g;
}

export function mic() {
  const g = group();
  put(g, sphere(0.62, metal("#d9c9b8", { roughness: 0.45 })), [0, 2.2, 0]);
  put(g, torus(0.6, 0.06, metal(C.gold)), [0, 2.05, 0], [Math.PI / 2, 0, 0]);
  put(g, cyl(0.22, 0.28, 1.0, plastic("#1c080b")), [0, 1.35, 0]);
  put(g, cyl(0.05, 0.05, 1.0, metal("#9a8f8a")), [0, 0.5, 0]);
  put(g, cyl(0.7, 0.8, 0.12, plastic("#1c080b")), [0, 0.0, 0]);
  return g;
}

export function cineCam() {
  const g = group();
  put(g, rbox(1.7, 1.1, 0.9, 0.16, plastic("#1c080b")), [0, 1.9, 0]);
  put(g, cyl(0.38, 0.45, 0.7, plastic(C.coral)), [1.15, 1.9, 0], [0, 0, Math.PI / 2]);
  put(g, cyl(0.5, 0.5, 0.1, glass("#9277ee")), [1.52, 1.9, 0], [0, 0, Math.PI / 2]);
  put(g, cyl(0.5, 0.5, 0.18, plastic(C.cream)), [-0.4, 2.85, 0], [Math.PI / 2, 0, 0]);
  put(g, cyl(0.42, 0.42, 0.18, plastic(C.cream)), [0.45, 2.78, 0], [Math.PI / 2, 0, 0]);
  [-0.5, 0.5].forEach((z) => put(g, cyl(0.05, 0.05, 1.4, metal("#8a7f7a")), [0, 0.7, z], [0, 0, 0]));
  put(g, rbox(1.4, 0.18, 1.3, 0.06, plastic(C.violet)), [0, 0.05, 0]);
  return g;
}

export function track(len = 7) {
  const g = group();
  [-0.45, 0.45].forEach((z) => put(g, cyl(0.06, 0.06, len, metal("#c7b9ad")), [0, 0, z], [0, 0, Math.PI / 2]));
  for (let i = 0; i < len / 0.6; i++) put(g, rbox(0.14, 0.06, 1.2, 0.02, matte("#5a2a2f")), [-len / 2 + i * 0.6, -0.06, 0]);
  return g;
}

export function cat(color = C.orange, o = {}) {
  const g = group();
  const fur = plastic(color, { roughness: 0.55, clearcoat: 0.2 });
  put(g, sphere(1, fur), [0, 0.85, 0], [0, 0, 0], [0.95, 0.9, 0.8]);
  put(g, sphere(0.68, fur), [0.15, 2.0, 0.15]);
  [-1, 1].forEach((s) => {
    put(g, cone(0.22, 0.45, fur), [0.15 + s * 0.36, 2.55, 0.1], [0, 0, -s * 0.35]);
    put(g, sphere(0.09, plastic("#1c080b")), [0.15 + s * 0.24, 2.08, 0.75]);
    put(g, sphere(0.03, glow("#ffffff", 2)), [0.15 + s * 0.24 + 0.03, 2.12, 0.83]);
  });
  put(g, sphere(0.07, plastic("#e98a95")), [0.15, 1.9, 0.82]);
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.7, 0.3, -0.3),
    new THREE.Vector3(-1.3, 0.5, 0.2),
    new THREE.Vector3(-1.2, 1.3, 0.4),
    new THREE.Vector3(-0.8, 1.6, 0.5),
  ]);
  put(g, mesh(new THREE.TubeGeometry(curve, 40, 0.14, 16), fur));
  [-0.4, 0.4].forEach((x) => put(g, sphere(0.25, fur), [x + 0.15, 0.18, 0.55], [0, 0, 0], [1, 0.7, 1.2]));
  if (o.scarf) {
    put(g, torus(0.5, 0.13, plastic(C.red)), [0.15, 1.45, 0.12], [Math.PI / 2 + 0.15, 0, 0]);
    put(g, rbox(0.28, 0.6, 0.12, 0.05, plastic(C.red)), [0.45, 1.1, 0.6], [0.2, 0, 0.3]);
  }
  if (o.collar) put(g, torus(0.46, 0.06, metal(C.gold)), [0.15, 1.48, 0.12], [Math.PI / 2 + 0.15, 0, 0]);
  return g;
}

export function person(color = C.coral, o = {}) {
  const g = group();
  put(g, capsule(0.42, 1.0, plastic(color)), [0, 0.95, 0]);
  put(g, sphere(0.36, plastic(o.skin ?? "#f2c6a8", { clearcoat: 0.1 })), [0, 2.2, 0]);
  put(g, sphere(0.39, plastic(o.hair ?? "#2a0d11")), [0, 2.32, -0.07], [0, 0, 0], [1, 0.85, 1]);
  if (o.long) put(g, capsule(0.3, 0.5, plastic(o.hair ?? "#2a0d11")), [0, 1.95, -0.2]);
  return g;
}

export function clapper() {
  const g = group();
  const stripes = tex(512, 96, (ctx, w, h) => {
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i % 2 ? "#fff5f3" : "#1c080b";
      ctx.beginPath();
      ctx.moveTo(i * 60 - 30, h);
      ctx.lineTo(i * 60 + 30, 0);
      ctx.lineTo(i * 60 + 90, 0);
      ctx.lineTo(i * 60 + 30, h);
      ctx.fill();
    }
  });
  put(g, rbox(2.2, 1.5, 0.14, 0.08, plastic("#1c080b")), [0, 0.75, 0]);
  const top = group();
  put(top, rbox(2.2, 0.36, 0.14, 0.05, plastic("#1c080b")), [1.1, 0, 0]);
  put(top, mesh(new THREE.PlaneGeometry(2.1, 0.3), screen(stripes)), [1.1, 0, 0.075]);
  put(g, top, [-1.1, 1.72, 0], [0, 0, 0.32]);
  [0.2, 0.6, 1.0].forEach((y, i) => put(g, rbox(1.6 - i * 0.3, 0.08, 0.02, 0.03, glow(C.cream, 0.6)), [-0.1, y, 0.08]));
  return g;
}

export function coins(n = 5, color = C.gold) {
  const g = group();
  for (let i = 0; i < n; i++) put(g, cyl(0.5, 0.5, 0.14, metal(color)), [(i % 2) * 0.04, 0.07 + i * 0.15, 0]);
  return g;
}

export function gift(color, s = 1, ribbon = C.cream) {
  const g = group();
  put(g, rbox(1.2, 1.0, 1.2, 0.08, plastic(color)), [0, 0.5, 0]);
  put(g, rbox(1.22, 0.24, 1.22, 0.06, plastic(color)), [0, 1.08, 0]);
  put(g, rbox(0.18, 1.25, 1.25, 0.03, plastic(ribbon)), [0, 0.6, 0]);
  put(g, rbox(1.25, 1.25, 0.18, 0.03, plastic(ribbon)), [0, 0.6, 0]);
  [-1, 1].forEach((d) => put(g, torus(0.2, 0.07, plastic(ribbon)), [d * 0.18, 1.32, 0], [0, 0, d * 0.6]));
  g.scale.setScalar(s);
  return g;
}

export function bulb() {
  const g = group();
  put(g, sphere(0.75, glow(C.cream, 1.4)), [0, 1.6, 0]);
  put(g, cyl(0.32, 0.36, 0.5, metal("#c7b9ad")), [0, 0.7, 0]);
  return g;
}

export function letter(glowing = true) {
  const g = group();
  put(g, rbox(1.8, 1.2, 0.05, 0.03, plastic("#fbefd8")), [0, 0, 0]);
  put(g, mesh(new THREE.PlaneGeometry(1.6, 1.0), screen(pageTex(6, { head: "#9277ee", bg: "#fbefd8" }))), [0, 0, 0.03]);
  if (glowing) {
    const l = new THREE.PointLight(C.cream, 6, 4);
    l.position.set(0, 0, 0.8);
    g.add(l);
  }
  return g;
}

export function keyframe(color) {
  return mesh(new THREE.OctahedronGeometry(0.35), plastic(color));
}

export function stopwatch() {
  const g = group();
  const face = tex(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#fff5f3";
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, 7);
    ctx.fill();
    ctx.fillStyle = "#e2574f";
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.arc(128, 128, 110, -Math.PI / 2, -Math.PI / 2 + 0.9);
    ctx.fill();
    ctx.strokeStyle = "#2a0d11";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.lineTo(128 + 80 * Math.cos(-Math.PI / 2 + 0.9), 128 + 80 * Math.sin(-Math.PI / 2 + 0.9));
    ctx.stroke();
  });
  put(g, cyl(0.8, 0.8, 0.25, plastic(C.cream)), [0, 0, 0], [Math.PI / 2, 0, 0]);
  put(g, mesh(new THREE.CircleGeometry(0.7, 48), screen(face)), [0, 0, 0.13]);
  put(g, cyl(0.12, 0.12, 0.3, plastic(C.coral)), [0, 0.95, 0]);
  return g;
}

export function laptop(map) {
  const g = group();
  put(g, rbox(3.2, 0.12, 2.1, 0.06, plastic("#2c1418")), [0, 0, 0]);
  const lid = group();
  put(lid, rbox(3.2, 2.1, 0.1, 0.06, plastic("#2c1418")), [0, 1.05, 0]);
  put(lid, mesh(new THREE.PlaneGeometry(3.0, 1.9), screen(map)), [0, 1.05, 0.055]);
  put(g, lid, [0, 0.06, -1.0], [-0.25, 0, 0]);
  return g;
}

export function waveform(n = 15, color = C.cream, h = 1.6) {
  const g = group();
  for (let i = 0; i < n; i++) {
    const v = 0.25 + Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37)) * h;
    put(g, rbox(0.14, v, 0.14, 0.07, glow(i % 4 === 0 ? C.coral : color, 0.9)), [i * 0.24 - (n * 0.24) / 2, 0, 0]);
  }
  return g;
}

export function stairs(n = 5) {
  const g = group();
  const cols = [C.coral, C.cream, C.violet, C.orange, C.coral];
  for (let i = 0; i < n; i++) put(g, rbox(0.9, 0.45 * (i + 1), 1.2, 0.08, plastic(cols[i % 5])), [i * 0.9, (0.45 * (i + 1)) / 2, 0]);
  return g;
}

export function door(color) {
  const g = group();
  put(g, rbox(1.2, 2.2, 0.25, 0.08, plastic(color)), [0, 1.1, 0]);
  put(g, mesh(new THREE.PlaneGeometry(0.85, 1.85), glow(C.cream, 1.2)), [0, 1.05, 0.13]);
  return g;
}

export function magnifier() {
  const g = group();
  put(g, torus(0.7, 0.1, plastic(C.coral)), [0, 0, 0]);
  put(g, cyl(0.68, 0.68, 0.04, glass("#e8f0ff")), [0, 0, 0], [Math.PI / 2, 0, 0]);
  put(g, capsule(0.11, 0.9, plastic("#1c080b")), [0.75, -0.95, 0], [0, 0, 0.65]);
  return g;
}

export function paperPlane(color = C.cream) {
  const geo = new THREE.BufferGeometry();
  const v = new Float32Array([0, 0, 1.4, -0.9, 0, -0.8, 0, 0, -0.5, 0, 0, 1.4, 0, 0, -0.5, 0.9, 0, -0.8, 0, 0, 1.4, 0, -0.35, -0.6, 0, 0, -0.5]);
  geo.setAttribute("position", new THREE.BufferAttribute(v, 3));
  geo.computeVertexNormals();
  return mesh(geo, plastic(color, { side: THREE.DoubleSide }));
}

export function rocket() {
  const g = group();
  put(g, capsule(0.45, 1.3, plastic(C.white)), [0, 1.3, 0]);
  put(g, cone(0.45, 0.6, plastic(C.coral)), [0, 2.5, 0]);
  put(g, sphere(0.18, glass("#9fd3ff")), [0, 1.6, 0.4]);
  [0, 1, 2].forEach((i) => put(g, rbox(0.1, 0.6, 0.5, 0.04, plastic(C.violet)), [Math.cos((i * Math.PI * 2) / 3) * 0.45, 0.55, Math.sin((i * Math.PI * 2) / 3) * 0.45], [0, -(i * Math.PI * 2) / 3, 0]));
  put(g, cone(0.3, 0.8, glow(C.orange, 2)), [0, -0.05, 0], [Math.PI, 0, 0]);
  return g;
}

export function globe() {
  const g = group();
  put(g, sphere(1.3, plastic(C.violet, { roughness: 0.5 })), [0, 0, 0]);
  const land = tex(1024, 512, (ctx, w, h) => {
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f7e8a4";
    [[230, 170, 150, 90], [300, 330, 70, 110], [560, 160, 160, 70], [600, 300, 90, 120], [820, 360, 80, 40]].forEach(([x, y, a, b]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, a, b, 0.3, 0, 7);
      ctx.fill();
    });
  });
  put(g, mesh(new THREE.SphereGeometry(1.31, 48, 32), new THREE.MeshStandardMaterial({ map: land, transparent: true, roughness: 0.6 })), [0, 0, 0], [0, -1.2, 0]);
  put(g, torus(1.7, 0.03, glow(C.coral, 1)), [0, 0, 0], [1.2, 0.3, 0]);
  return g;
}

export function umbrella() {
  const g = group();
  put(g, mesh(new THREE.SphereGeometry(1.5, 8, 16, 0, Math.PI * 2, 0, Math.PI / 2), plastic(C.coral, { side: THREE.DoubleSide, flatShading: true })), [0, 2.6, 0]);
  put(g, cyl(0.04, 0.04, 2.6, metal("#c7b9ad")), [0, 1.4, 0]);
  put(g, torus(0.2, 0.05, metal("#c7b9ad"), Math.PI), [0.2, 0.1, 0], [0, 0, Math.PI]);
  return g;
}

export function funnel() {
  const g = group();
  put(g, mesh(new THREE.CylinderGeometry(1.3, 0.25, 1.8, 48, 1, true), plastic(C.violet, { side: THREE.DoubleSide })), [0, 1.6, 0]);
  put(g, cyl(0.25, 0.25, 0.6, plastic(C.violet)), [0, 0.4, 0]);
  [C.coral, C.cream, C.orange, C.coral].forEach((c, i) => put(g, sphere(0.2, plastic(c)), [-0.6 + i * 0.4, 2.7 + (i % 2) * 0.3, 0]));
  return g;
}

export function island(color, top) {
  const g = group();
  put(g, cyl(1.0, 0.6, 0.6, plastic(color)), [0, 0, 0]);
  put(g, cone(0.6, 0.8, plastic(color)), [0, -0.7, 0], [Math.PI, 0, 0]);
  if (top) put(g, top, [0, 0.3, 0]);
  return g;
}

export function sign() {
  const g = group();
  put(g, cyl(0.07, 0.07, 3, plastic("#2c1418")), [0, 1.5, 0]);
  put(g, rbox(1.4, 0.4, 0.1, 0.06, plastic(C.coral)), [0.55, 2.6, 0], [0, 0, 0.12]);
  put(g, rbox(1.4, 0.4, 0.1, 0.06, plastic(C.violet)), [-0.55, 2.0, 0], [0, 0, -0.12]);
  return g;
}

export function tower() {
  const g = group();
  put(g, cyl(0.25, 0.45, 3, plastic(C.violet)), [0, 1.5, 0]);
  put(g, sphere(0.45, glow(C.cream, 2)), [0, 3.25, 0]);
  [0.8, 1.2].forEach((r, i) => put(g, torus(r, 0.03, glow(C.cream, 0.8)), [0, 3.25, 0], [Math.PI / 2 + 0.2 * i, 0, 0]));
  return g;
}

export function reel(color) {
  const g = group();
  put(g, cyl(0.9, 0.9, 0.18, plastic(color)), [0, 0, 0], [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5;
    put(g, cyl(0.17, 0.17, 0.2, plastic("#1c080b")), [Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0], [Math.PI / 2, 0, 0]);
  }
  put(g, cyl(0.12, 0.12, 0.22, metal()), [0, 0, 0], [Math.PI / 2, 0, 0]);
  return g;
}

export function metronome() {
  const g = group();
  const geo = new THREE.CylinderGeometry(0.35, 0.9, 2.4, 4);
  put(g, mesh(geo, plastic(C.coralDeep, { flatShading: true })), [0, 1.2, 0], [0, Math.PI / 4, 0]);
  put(g, cyl(0.04, 0.04, 2.2, metal()), [0.35, 1.5, 0.45], [0, 0, -0.35]);
  put(g, rbox(0.25, 0.25, 0.1, 0.05, metal()), [0.6, 2.2, 0.45]);
  return g;
}

export function hook() {
  const g = group();
  put(g, torus(0.55, 0.09, metal(C.cream), Math.PI * 1.3), [0, 0, 0], [0, 0, Math.PI * 0.85]);
  put(g, cyl(0.09, 0.09, 1.6, metal(C.cream)), [0.55, 0.8, 0]);
  put(g, torus(0.15, 0.05, metal(C.cream)), [0.55, 1.65, 0]);
  put(g, cone(0.14, 0.32, metal(C.cream)), [-0.48, 0.3, 0], [0, 0, 0.6]);
  return g;
}

export function scissorsCut() {
  const g = group();
  [-1, 1].forEach((s) => {
    const b = group();
    put(b, torus(0.28, 0.07, plastic(C.coral)), [-0.6, 0, 0]);
    put(b, rbox(1.3, 0.12, 0.05, 0.05, metal("#d8d0cc")), [0.4, 0, 0]);
    put(g, b, [0, 0, s * 0.03], [0, 0, s * 0.3]);
  });
  return g;
}

export function bars(vals, cols) {
  const g = group();
  vals.forEach((v, i) => put(g, rbox(0.55, v, 0.55, 0.08, plastic(cols[i % cols.length])), [i * 0.75, v / 2, 0]));
  return g;
}

export function conveyor(len = 6) {
  const g = group();
  put(g, rbox(len, 0.25, 1.4, 0.1, plastic("#2c1418")), [0, 0, 0]);
  for (let i = 0; i < 6; i++) put(g, cyl(0.16, 0.16, 1.5, metal("#c7b9ad")), [-len / 2 + 0.5 + i * ((len - 1) / 5), -0.25, 0], [Math.PI / 2, 0, 0]);
  return g;
}

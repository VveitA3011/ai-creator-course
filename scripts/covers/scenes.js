import * as THREE from "three";
import * as K from "./kit.js";
const { C, put, group } = K;

const ms = K.miniScene;
const sky = {
  warm: ["#f3b15c", "#c9523f"],
  night: ["#3b4a7a", "#1c0f2b"],
  rain: ["#7d8a96", "#55616d"],
  violet: ["#b4a2f7", "#5a3fb0"],
  cream: ["#fbf0bd", "#efcf78"],
  dark: ["#3a1319", "#120608"],
};
const R = (d) => (d * Math.PI) / 180;

/* Hàng khung storyboard */
function frameRow(g, kinds, o = {}) {
  const w = o.w ?? 0.95;
  const gap = o.gap ?? 1.2;
  kinds.forEach((k, i) => {
    const [kind, opt] = Array.isArray(k) ? k : [k, {}];
    const x = (i - (kinds.length - 1) / 2) * gap;
    put(g, K.frame9(ms(kind, opt), w, o.border ?? C.white), [x, (o.y ?? 2) + (o.wave ? Math.sin(i) * 0.25 : 0), 0], [0, R(-14), R(o.tilt ? (i % 2 ? 4 : -4) : 0)]);
  });
}

export const scenes = {
  /* ---------- Module 0 ---------- */
  "nghe-ai-creator": (g) => {
    put(g, K.phone(K.phoneUI("play")), [0, 2.1, 0.5], [0, R(-18), R(4)]);
    put(g, K.frame9(ms("person", { sky: sky.violet }), 0.8), [-1.7, 2.7, -0.6], [0, R(10), R(-10)]);
    put(g, K.frame9(ms("bottle", { sky: sky.warm }), 0.8), [1.8, 2.9, -0.7], [0, R(-25), R(9)]);
    put(g, K.clapper(), [1.1, 0, 1.2], [0, R(-30), 0], 0.65);
  },
  "tu-danh-gia-chon-ngach": (g) => {
    [C.coral, C.cream, C.violet, C.orange, C.coralDeep].forEach((c, i) => put(g, K.door(c), [(i - 2) * 1.35, 0, -Math.abs(i - 2) * 0.4], [0, R(-10), 0]));
    put(g, K.person(C.white), [0.2, 0, 2.2], [0, R(160), 0], 0.55);
  },
  "bo-cong-cu": (g) => {
    put(g, K.mic(), [-1.6, 0, 0], [0, R(20), 0], 0.8);
    put(g, K.cineCam(), [0.5, 0, -0.4], [0, R(-35), 0], 0.75);
    put(g, K.frame9(ms("person", { sky: sky.cream }), 0.7), [2.3, 1.8, 0], [0, R(-20), R(6)]);
    put(g, K.scissorsCut(), [-0.2, 3.2, 0.6], [R(10), 0, R(-15)], 0.9);
  },
  "pipeline-chuan-ban-giao": (g) => {
    put(g, K.conveyor(6.4), [0, 0.6, 0], [0, R(-12), 0]);
    put(g, K.panel(K.pageTex(7), 0.7, 0.9), [-2.3, 1.4, 0.3], [R(-10), R(-12), 0]);
    put(g, K.panel(K.pageTex(9, { head: C.violet }), 0.7, 0.9), [-0.9, 1.4, 0.1], [R(-10), R(-12), 0]);
    put(g, K.frame9(ms("person", { sky: sky.violet }), 0.6), [0.4, 1.6, 0], [0, R(-12), 0]);
    put(g, K.phone(K.phoneUI("play")), [2.2, 2.4, 0], [0, R(-14), R(-4)], 0.85);
  },

  /* ---------- Tuần 1 ---------- */
  "hook-3-giay-dau": (g) => {
    put(g, K.phone(K.phoneUI("play")), [0.6, 1.9, 0], [0, R(-16), R(6)]);
    put(g, K.hook(), [-0.9, 2.4, 0.9], [0, 0, R(-15)], 1.1);
    put(g, K.stopwatch(), [2.2, 0.9, 0.9], [0, R(-25), 0], 0.8);
  },
  "cau-truc-quang-cao-ngan": (g) => {
    put(g, K.cyl(1.2, 1.3, 0.4, K.plastic(C.coralDeep)), [0, 0.2, 0]);
    put(g, K.bottle(C.orange), [0, 0.4, 0], [0, R(-20), 0], 0.95);
    [C.coral, C.cream, C.violet, C.orange].forEach((c, i) => put(g, K.rbox(0.5 + i * 0.25, 0.3, 0.3, 0.1, K.glow(c, 0.7)), [-1.4 + i * 0.95, 3.6, 0.5]));
  },
  "cau-truc-storytelling": (g) => {
    put(g, K.cat(C.orange, { collar: true }), [0, 0, 0.4], [0, R(-25), 0], 1.05);
    put(g, K.rbox(4.5, 0.18, 2.4, 0.06, K.plastic("#5a2a2f")), [0, 3.6, -0.3], [R(8), 0, 0]);
    [-2, 2].forEach((x) => put(g, K.cyl(0.08, 0.08, 3.6, K.plastic("#2c1418")), [x, 1.8, 0.75]));
    for (let i = 0; i < 30; i++) put(g, K.capsule(0.015, 0.35, K.glow("#cfe0ff", 0.6)), [-2.4 + (i * 0.37) % 4.8, 0.4 + ((i * 1.7) % 3.2), 1.5 + (i % 3) * 0.35], [0, 0, R(10)]);
  },
  "viet-voice-over": (g) => {
    put(g, K.mic(), [-0.8, 0, 0], [0, R(15), R(-6)]);
    put(g, K.waveform(12, C.cream, 1.4), [1.6, 2.2, 0.2], [0, R(-15), 0], 0.95);
  },
  "cao-trao-va-cta": (g) => {
    put(g, K.cone(2.1, 3.2, K.plastic(C.coralDeep, { flatShading: true }), 6), [0, 1.6, 0], [0, R(15), 0]);
    put(g, K.cone(1.0, 1.5, K.plastic(C.cream, { flatShading: true }), 6), [0, 2.6, 0], [0, R(15), 0]);
    put(g, K.cyl(0.55, 0.55, 0.22, K.glow(C.coral, 1.3)), [0, 3.65, 0], [R(70), 0, 0]);
    put(g, K.reel(C.violet), [-2.3, 0.9, 0.8], [0, R(20), 0], 0.6);
  },
  "tu-duy-hinh-anh": (g) => {
    put(g, K.panel(K.pageTex(10), 1.4, 1.8, C.white), [-1.8, 2, 0], [0, R(18), R(-4)]);
    [sky.warm, sky.violet, sky.rain].forEach((s, i) => put(g, K.frame9(ms(["person", "window", "cat"][i], { sky: s, rain: i === 2 }), 0.7), [0.2 + i * 1.05, 1.7 + i * 0.35, -i * 0.2], [0, R(-18), R(3 - i * 3)]));
  },

  /* ---------- Tuần 2 ---------- */
  "thiet-ke-nhan-vat": (g) => {
    [0, 40, 90, 180].forEach((a, i) => put(g, K.person(C.cream, { long: true }), [(i - 1.5) * 1.3, 0, 0], [0, R(-a), 0], 1));
  },
  "thiet-ke-boi-canh": (g) => {
    put(g, K.rbox(4, 0.2, 3, 0.08, K.plastic("#5a2a2f")), [0, 0.1, 0]);
    put(g, K.rbox(4, 2.6, 0.15, 0.06, K.plastic("#3a1a20")), [0, 1.4, -1.45]);
    put(g, K.rbox(0.15, 2.6, 3, 0.06, K.plastic("#46212a")), [-1.95, 1.4, 0]);
    put(g, K.mesh(new THREE.PlaneGeometry(1.2, 1.1), K.glow(C.cream, 1.1)), [0.6, 1.7, -1.36]);
    put(g, K.rbox(1.2, 0.7, 0.7, 0.05, K.plastic(C.orange)), [0.7, 0.55, -0.8]);
    put(g, K.rbox(1.6, 0.5, 1.0, 0.1, K.plastic(C.violet)), [-1.0, 0.45, 0.5]);
    put(g, K.rbox(0.6, 0.45, 0.6, 0.04, K.plastic(C.cream)), [1.1, 0.42, 0.8], [0, R(20), 0]);
    g.rotation.x = R(18);
  },
  "ngon-ngu-may-quay": (g) => {
    put(g, K.track(6), [-0.5, 0.06, 0.6], [0, R(-10), 0]);
    put(g, K.cineCam(), [-1.6, 0.1, 0.6], [0, R(-10), 0], 0.75);
    put(g, K.person(C.coral), [2.4, 0, 0.2], [0, R(-80), 0], 0.85);
    [1.6, 1.15, 0.75].forEach((s, i) => put(g, K.torus(s, 0.025, K.glow([C.cream, C.violet, C.coral][i], 1)), [2.4, 1.7, 0.4], [0, R(-80), 0]));
  },
  "anh-sang-mau-sac": (g) => {
    put(g, K.sphere(1.25, K.plastic("#efe2d6", { clearcoat: 0.3 })), [0, 1.4, 0]);
    [[C.coral, [-2.2, 2.6, 1]], [C.cream, [2.2, 3, 0.6]], [C.violet, [0.4, 0.4, 2.2]]].forEach(([c, p]) => {
      const l = new THREE.PointLight(c, 40, 6);
      l.position.set(...p);
      g.add(l);
      put(g, K.cyl(0.25, 0.4, 0.5, K.glow(c, 1.6)), p, [0, 0, 0], 0.8);
    });
  },
  storyboard: (g) => {
    put(g, K.rbox(5.4, 3.6, 0.1, 0.1, K.plastic("#2c1418")), [0, 2, -0.3]);
    const kinds = [["bottle", { sky: sky.dark, fg: "#e8c27a" }], ["person", { sky: sky.warm }], ["person", { sky: sky.warm, scale: 1.6 }], ["bottle", { sky: sky.dark, scale: 1.4, fg: "#e8c27a" }], ["person", { sky: sky.violet, scale: 2.2 }], ["bottle", { sky: sky.dark, fg: C.cream }]];
    kinds.forEach(([k, o], i) => put(g, K.frame9(ms(k, o), 0.62), [-1.9 + (i % 3) * 1.9, 2.9 - Math.floor(i / 3) * 1.65, -0.2], [0, 0, R(((i * 7) % 5) - 2)]));
    put(g, K.torus(2.8, 0.02, K.glow(C.coral, 1.2), Math.PI), [0, 2, -0.15], [0, 0, 0], [1, 0.5, 1]);
  },

  /* ---------- Tuần 3 ---------- */
  "text-to-video": (g) => {
    for (let i = 0; i < 5; i++) put(g, K.rbox(0.6, 0.2, 0.6, 0.08, K.plastic(i === 2 ? C.coral : "#2c1418")), [-1.8 + i * 0.7, 0.1, 1.2]);
    for (let i = 0; i < 4; i++) put(g, K.frame9(ms(["bottle", "person", "window", "cat"][i], { sky: [sky.warm, sky.violet, sky.night, sky.cream][i] }), 0.55), [-0.6 + i * 0.9, 1.3 + i * 0.55, 0.6 - i * 0.4], [0, R(-15), R(-8 + i * 5)]);
  },
  "image-to-video": (g) => {
    put(g, K.panel(ms("window", { sky: sky.violet }), 1.6, 2.4, C.white), [-0.8, 2.1, 0], [0, R(15), 0]);
    put(g, K.person(C.coral, { long: true }), [1.0, 0, 0.6], [0, R(-40), 0], 0.95);
    [0.35, 0.22, 0.1].forEach((o, i) => {
      const p = K.person(C.coral, { long: true });
      p.traverse((m) => m.isMesh && (m.material = m.material.clone(), (m.material.transparent = true), (m.material.opacity = o)));
      put(g, p, [0.3 - i * 0.45, 0, 0.4], [0, R(-40), 0], 0.95);
    });
  },
  "camera-movement": (g) => {
    put(g, K.bottle(C.violet), [0, 0, 0], [0, R(-20), 0], 0.9);
    put(g, K.torus(1.9, 0.05, K.glow(C.cream, 1.4), Math.PI * 1.5), [0, 1.3, 0], [R(62), 0, R(20)]);
    put(g, K.cone(0.16, 0.35, K.glow(C.cream, 1.4)), [1.75, 1.0, 0.75], [0, 0, R(-30)]);
    put(g, K.cineCam(), [-2.1, 0.2, 0.9], [0, R(50), 0], 0.55);
  },
  "character-reference": (g) => {
    [sky.warm, sky.violet, sky.rain, sky.cream].forEach((s, i) => put(g, K.frame9(ms("person", { sky: s, rain: i === 2 }), 0.68), [-1.2 + i * 1.0, 2, -Math.abs(i - 1.5) * 0.3], [0, R(-12), R((i - 1.5) * 3)]));
    put(g, K.panel(ms("person", { sky: ["#fff5f3", "#e6d6cc"], scale: 1.8 }), 0.8, 0.8, C.coral), [2.4, 3.3, 0.6], [0, R(-20), R(8)]);
  },
  "multi-shot-keyframe": (g) => {
    put(g, K.frame9(ms("person", { sky: sky.warm, x: 0.3 }), 0.8), [-2, 2, 0], [0, R(-10), 0]);
    put(g, K.frame9(ms("person", { sky: sky.warm, x: 0.7, scale: 1.6 }), 0.8), [2, 2, 0], [0, R(-10), 0]);
    for (let i = 0; i < 5; i++) {
      const f = K.frame9(ms("person", { sky: sky.warm, x: 0.35 + i * 0.07, scale: 1 + i * 0.12 }), 0.45);
      f.traverse((m) => m.isMesh && ((m.material = m.material.clone()), (m.material.transparent = true), (m.material.opacity = 0.55)));
      put(g, f, [-1.05 + i * 0.52, 2, -0.3], [0, R(-10), 0]);
    }
    put(g, K.keyframe(C.cream), [-2, 0.2, 0.3], [0, 0, R(45)], 0.7);
    put(g, K.keyframe(C.cream), [2, 0.2, 0.3], [0, 0, R(45)], 0.7);
  },
  "tao-chuoi-canh": (g) => {
    put(g, K.panel(ms("window", { sky: sky.rain, rain: true }), 2.2, 2.0, "#2c1418"), [0.4, 2.4, -0.6]);
    put(g, K.person(C.cream, { long: true }), [-0.6, 0, 0.3], [0, R(-140), 0], 0.85);
    put(g, K.cyl(0.18, 0.15, 0.3, K.plastic(C.coral)), [0.6, 1.15, 0.6]);
    put(g, K.cyl(0.9, 0.9, 0.08, K.plastic("#5a2a2f")), [0.6, 1.0, 0.6]);
    put(g, K.cyl(0.08, 0.08, 1.0, K.plastic("#2c1418")), [0.6, 0.5, 0.6]);
  },
  "chon-loc-sua-loi": (g) => {
    for (let i = 0; i < 5; i++) put(g, K.frame9(ms(["person", "person", "cat", "bottle", "window"][i], { sky: [sky.warm, sky.violet, sky.rain, sky.dark, sky.cream][i] }), 0.55), [-2 + i * 0.95, 1.5, 0], [0, R(-10), 0]);
    put(g, K.magnifier(), [0.0, 2.1, 1.0], [0, R(-15), R(-10)], 1.1);
    put(g, K.sphere(0.3, K.glow(C.cream, 1.2)), [1.85, 2.9, 0.3]);
  },

  /* ---------- Tuần 4 ---------- */
  "voice-over-elevenlabs": (g) => {
    put(g, K.mic(), [-1.4, 0, 0], [0, R(20), 0], 0.9);
    put(g, K.waveform(10, C.violet, 1.1), [0.3, 2.0, 0.3], [0, R(-15), 0], 0.8);
    put(g, K.phone(K.phoneUI("play")), [2.3, 1.9, -0.2], [0, R(-20), R(4)], 0.85);
  },
  "nhip-doc-cam-xuc": (g) => {
    put(g, K.metronome(), [-1.4, 0, 0], [0, R(25), 0], 1.1);
    put(g, K.waveform(14, C.coral, 1.8), [1.2, 1.8, 0.4], [0, R(-15), 0], 0.85);
  },
  "nhac-nen-hieu-ung": (g) => {
    [[C.coral, 2.8], [C.violet, 1.9], [C.cream, 1.0]].forEach(([c, y], i) => {
      put(g, K.rbox(4.2, 0.08, 1.2, 0.04, K.plastic(c, { transmission: 0.4, roughness: 0.2 })), [0, y, -i * 0.3], [R(10), R(-12), 0]);
      put(g, K.waveform(14, c, 0.6), [0, y + 0.3, -i * 0.3], [0, R(-12), 0], 0.8);
    });
  },
  "cat-dung-theo-nhip": (g) => {
    put(g, K.panel(K.timelineTex(), 4.4, 1.6), [0, 1.6, 0], [R(-20), R(-10), 0]);
    put(g, K.scissorsCut(), [0.8, 2.9, 0.8], [0, 0, R(-60)], 1.1);
  },
  "phu-de": (g) => {
    put(g, K.phone(K.frame9 && K.miniScene("person", { sky: sky.violet, sub: true })), [0.2, 2.0, 0], [0, R(-16), R(3)], 1.15);
    put(g, K.rbox(1.8, 0.3, 0.1, 0.12, K.glow(C.cream, 0.8)), [1.5, 1.2, 0.8], [0, R(-16), 0]);
  },
  "keyframe-zoom": (g) => {
    put(g, K.rbox(4.6, 0.12, 0.6, 0.06, K.plastic("#2c1418")), [0, 0.4, 0.6], [0, R(-10), 0]);
    put(g, K.keyframe(C.cream), [-1.6, 0.75, 0.7], [0, 0, R(45)], 0.7);
    put(g, K.keyframe(C.coral), [1.6, 0.75, 0.4], [0, 0, R(45)], 0.7);
    put(g, K.frame9(ms("person", { sky: sky.warm }), 0.55), [-1.6, 2.2, 0], [0, R(-10), 0]);
    put(g, K.frame9(ms("person", { sky: sky.warm, scale: 1.7 }), 0.95), [1.4, 2.5, -0.2], [0, R(-10), 0]);
  },
  "color-grading-xuat-video": (g) => {
    [0, 1.2, 2.4].forEach((s, i) => put(g, K.mesh(new THREE.CircleGeometry(0.7, 64), K.screen(K.wheelTex(s))), [-1.8 + i * 1.6, 0.9, 0.6], [0, R(-12), 0]));
    put(g, K.frame9(ms("person", { sky: ["#9a8f8a", "#6c6560"] }), 0.8), [-0.5, 3.0, 0], [0, R(-12), 0]);
    put(g, K.frame9(ms("person", { sky: sky.warm }), 0.8), [0.6, 3.0, 0], [0, R(-12), 0]);
  },

  /* ---------- Tuần 5 ---------- */
  "brief-va-concept": (g) => {
    put(g, K.bottle(C.coral), [-0.6, 0, 0], [0, R(-25), 0], 0.9);
    put(g, K.panel(K.pageTex(8), 0.9, 1.2, C.white), [1.4, 1.0, 0.6], [R(-30), R(-20), R(8)]);
    put(g, K.bulb(), [1.0, 2.4, -0.4], [0, 0, R(10)], 0.8);
  },
  "cinematic-commercial": (g) => {
    put(g, K.rbox(4.5, 0.3, 2.4, 0.06, K.plastic("#160709", { roughness: 0.15, clearcoat: 1 })), [0, 0.15, 0]);
    put(g, K.bottle(C.orange, { cap: C.gold }), [0, 0.3, 0], [0, R(-30), 0], 1.1);
    for (let i = 0; i < 10; i++) put(g, K.sphere(0.04 + (i % 3) * 0.02, K.glass("#ffffff")), [-0.4 + (i * 0.13) % 0.8, 0.9 + ((i * 0.37) % 1.2), 0.45], [0, 0, 0]);
    const l = new THREE.PointLight(C.orange, 60, 5);
    l.position.set(0.3, 2, -1.5);
    g.add(l);
  },
  "social-media-ad": (g) => {
    put(g, K.phone(K.phoneUI("ad")), [0.2, 2.0, 0], [0, R(-18), R(-6)], 1.05);
    [[C.coral, -1.4, 3.6], [C.cream, 1.7, 3.2], [C.violet, 1.9, 1.3], [C.coral, -1.6, 1.4]].forEach(([c, x, y], i) => put(g, K.sphere(0.22 + (i % 2) * 0.1, K.plastic(c)), [x, y, 0.7]));
  },
  "danh-gia-hai-phien-ban": (g) => {
    put(g, K.phone(K.miniScene("bottle", { sky: sky.dark, fg: C.gold })), [-1.4, 2, 0], [0, R(-10), R(4)], 0.9);
    put(g, K.phone(K.phoneUI("ad")), [1.6, 2, 0], [0, R(-20), R(-4)], 0.9);
    put(g, K.bars([0.8, 1.3, 1.0, 1.6], [C.coral, C.cream, C.violet]), [-1.0, 0, 1.4], [0, R(-10), 0], 0.6);
  },

  /* ---------- Tuần 6 ---------- */
  "buc-thu-kich-ban": (g) => {
    put(g, K.person(C.cream, { long: true }), [-0.6, 0, 0], [0, R(-30), 0], 1.05);
    put(g, K.letter(), [0.6, 1.7, 0.9], [R(-15), R(-30), R(10)], 0.75);
    for (let i = 0; i < 18; i++) put(g, K.sphere(0.03, K.glow(C.cream, 1.5)), [-1.5 + (i * 0.41) % 3.4, 0.6 + ((i * 0.73) % 3), -0.5 + (i % 3) * 0.6]);
  },
  "buc-thu-san-xuat": (g) => {
    put(g, K.rbox(3.6, 1.7, 1.4, 0.3, K.plastic(C.violet)), [0.6, 1.1, -1.0]);
    put(g, K.mesh(new THREE.PlaneGeometry(0.7, 1.2), K.glow(C.cream, 1)), [0.0, 1.0, -0.29]);
    [-0.4, 0.4, 1.2, 2.0].forEach((x, i) => i && put(g, K.mesh(new THREE.PlaneGeometry(0.6, 0.5), K.glow("#cfe0ff", 0.5)), [x, 1.5, -0.29]));
    [-0.6, 1.8].forEach((x) => put(g, K.cyl(0.32, 0.32, 0.2, K.plastic("#1c080b")), [x, 0.3, -0.25], [Math.PI / 2, 0, 0]));
    put(g, K.person(C.coral, { long: true }), [-1.6, 0, 0.8], [0, R(-60), 0], 0.95);
    put(g, K.letter(false), [-1.25, 1.35, 1.2], [0, R(-60), 0], 0.35);
  },
  "chu-meo-nhan-vat": (g) => {
    [[-1.8, -10], [-0.6, 20], [0.6, -30], [1.8, 40]].forEach(([x, a], i) => put(g, K.cat(C.orange, { scarf: true }), [x, 0, -Math.abs(i - 1.5) * 0.3], [0, R(a), R(i === 2 ? -8 : 0)], 0.62));
  },
  "chu-meo-san-xuat": (g) => {
    const roofs = [[-1.8, 1.2, C.coralDeep], [0, 1.7, C.violet], [1.8, 1.0, C.coralDeep]];
    roofs.forEach(([x, h, c]) => {
      put(g, K.rbox(1.6, h, 1.4, 0.06, K.plastic(c)), [x, h / 2, -0.4]);
      put(g, K.cone(1.15, 0.7, K.plastic(C.coral, { flatShading: true }), 4), [x, h + 0.35, -0.4], [0, R(45), 0]);
    });
    put(g, K.cat(C.orange, { scarf: true }), [0, 2.05, -0.2], [0, R(-40), 0], 0.45);
    put(g, K.sphere(0.8, K.glow(C.cream, 1.6)), [2.2, 3.6, -2]);
  },

  /* ---------- Tuần 7 ---------- */
  "chon-san-pham": (g) => {
    put(g, K.rbox(5, 0.18, 2.6, 0.06, K.plastic("#5a2a2f")), [0, 0.6, 0]);
    const ks = [["bottle", sky.dark], ["person", sky.warm], ["cat", sky.night], ["person", sky.violet], ["bottle", sky.cream], ["window", sky.rain]];
    ks.forEach(([k, s], i) => put(g, K.frame9(ms(k, { sky: s, fg: k === "bottle" ? C.gold : undefined }), 0.55), [-1.9 + i * 0.78, 0.73 + (i === 1 || i === 3 ? 0.9 : 0), 0.4 - (i % 2) * 0.5], [i === 1 || i === 3 ? 0 : R(-88), 0, R((i - 2.5) * 6)]));
  },
  "viet-case-study": (g) => {
    put(g, K.rbox(3.6, 0.1, 2.6, 0.08, K.plastic(C.orange)), [0, 0.05, 0], [0, R(-10), 0]);
    put(g, K.rbox(3.6, 2.4, 0.1, 0.08, K.plastic(C.orange)), [0, 1.2, -1.3], [R(-10), R(-10), 0]);
    put(g, K.panel(K.pageTex(8), 0.9, 1.2, C.white), [-1.1, 1.3, -0.9], [0, R(-10), R(-5)]);
    for (let i = 0; i < 3; i++) put(g, K.frame9(ms("person", { sky: [sky.warm, sky.violet, sky.cream][i] }), 0.38), [0.1 + i * 0.5, 1.3, -0.95], [0, R(-10), 0]);
    put(g, K.phone(K.phoneUI("play")), [1.4, 1.5, 0.4], [0, R(-20), R(8)], 0.7);
  },
  "trinh-bay-portfolio": (g) => {
    put(g, K.laptop(K.phoneUI("grid")), [-0.5, 0, 0], [0, R(-15), 0], 1.0);
    put(g, K.phone(K.phoneUI("grid")), [2.0, 1.7, 0.6], [0, R(-25), R(5)], 0.75);
  },

  /* ---------- Tuần 8 ---------- */
  "ba-goi-dich-vu": (g) => {
    put(g, K.gift(C.cream, 0.7, C.coral), [-1.6, 0, 0.3], [0, R(20), 0]);
    put(g, K.gift(C.coral, 1.0), [0, 0, 0], [0, R(-15), 0]);
    put(g, K.gift(C.violet, 1.35), [1.9, 0, -0.4], [0, R(-30), 0]);
  },
  "pham-vi-ban-giao": (g) => {
    put(g, K.panel(K.pageTex(8, { head: C.violet }), 1.3, 1.8, C.cream), [-1.2, 1.7, 0], [0, R(15), R(-4)]);
    put(g, K.gift(C.coral, 0.95), [1.3, 0, 0.3], [0, R(-25), 0]);
    put(g, K.rbox(3.2, 0.1, 0.4, 0.03, K.plastic(C.cream)), [0.4, 0.06, 1.4], [0, R(-10), 0]);
  },
  "ho-so-tim-job": (g) => {
    put(g, K.panel(ms("person", { sky: ["#fff5f3", "#e6d6cc"], scale: 1.5 }), 1.6, 2.0, C.coral), [0, 2, 0], [0, R(-15), 0]);
    put(g, K.cone(1.6, 3, new THREE.MeshBasicMaterial({ color: C.cream, transparent: true, opacity: 0.12 })), [0, 3.4, 0.4]);
    [[-2, 1], [2.1, 2.8], [1.9, 0.7]].forEach(([x, y], i) => {
      const b = group();
      put(b, K.rbox(0.9, 0.65, 0.35, 0.08, K.plastic([C.violet, C.orange, C.cream][i])));
      put(b, K.torus(0.18, 0.05, K.plastic("#1c080b"), Math.PI), [0, 0.32, 0]);
      put(g, b, [x, y, 0.5], [0, R(-20), R(10)], 0.8);
    });
  },

  /* ---------- Final ---------- */
  "the-last-letter": (g) => {
    put(g, K.panel(ms("window", { sky: sky.night }), 2, 2.4, "#2c1418"), [0.9, 2.3, -0.8]);
    put(g, K.person(C.cream, { long: true }), [-0.7, 0, 0.2], [0, R(-20), 0], 1.05);
    put(g, K.letter(), [0.3, 1.7, 0.8], [R(-20), R(-25), R(6)], 0.7);
  },

  /* ---------- Freelance ---------- */
  "mo-hinh-kinh-doanh": (g) => {
    put(g, K.rbox(3.8, 0.2, 2.2, 0.08, K.plastic("#5a2a2f")), [0, 1.2, 0]);
    [-1.6, 1.6].forEach((x) => put(g, K.cyl(0.07, 0.07, 1.2, K.plastic("#2c1418")), [x, 0.6, 0]));
    put(g, K.laptop(K.phoneUI("grid")), [-0.3, 1.3, 0], [0, R(-10), 0], 0.55);
    [C.coral, C.cream, C.violet].forEach((c, i) => put(g, K.rbox(1.0, 0.45, 0.08, 0.1, K.plastic(c)), [-1.2 + i * 1.2, 3.0, -0.6], [0, 0, R(i - 1) * 4]));
    put(g, K.sphere(0.4, K.plastic("#5aa06c")), [1.4, 1.75, 0.3]);
    put(g, K.cyl(0.25, 0.2, 0.4, K.plastic(C.coral)), [1.4, 1.4, 0.3]);
  },
  "chon-khach-hang": (g) => {
    put(g, K.person(C.coral), [-1.8, 0, 0], [0, R(-10), 0], 0.75);
    put(g, K.gift(C.cream, 0.45, C.coral), [-1.1, 0, 0.5]);
    [C.violet, C.violet, C.violet].forEach((c, i) => put(g, K.person(c), [-0.2 + i * 0.55, 0, -0.3 + (i % 2) * 0.4], [0, R(-20), 0], 0.6));
    put(g, K.person(C.cream), [2.3, 0, 0], [0, R(-40), 0], 0.75);
    put(g, K.cineCam(), [2.0, 1.8, 0.5], [0, R(-40), 0], 0.3);
  },
  "dong-goi-va-gia": (g) => {
    [0.5, 0.7, 0.9, 1.1, 1.3].forEach((s, i) => {
      put(g, K.gift([C.cream, C.coral, C.violet, C.orange, C.coral][i], s), [-2.2 + i * 1.1 + s * 0.2, 0, -i * 0.15], [0, R(-20), 0]);
      put(g, K.rbox(0.35, 0.5, 0.04, 0.05, K.plastic(C.white)), [-2.2 + i * 1.1 + s * 0.2 + 0.2, s * 1.35 + 0.35, 0.3], [0, 0, R(15)]);
    });
  },
  "co-cau-doanh-thu": (g) => {
    [[C.gold, 7], [C.coral, 4], [C.violet, 2]].forEach(([c, n], i) => put(g, K.coins(n, c), [-1.4 + i * 1.2, 0, 0], [0, 0, 0], 1.1));
    const calc = group();
    put(calc, K.rbox(1.3, 1.8, 0.2, 0.12, K.plastic("#2c1418")));
    put(calc, K.mesh(new THREE.PlaneGeometry(1.0, 0.4), K.glow(C.cream, 0.7)), [0, 0.55, 0.11]);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) put(calc, K.rbox(0.24, 0.2, 0.06, 0.05, K.plastic(c === 2 ? C.coral : "#5a2a2f")), [-0.32 + c * 0.32, 0.05 - r * 0.3, 0.12]);
    put(g, calc, [2.3, 1.0, 0.3], [R(-15), R(-20), 0]);
  },
  "phi-nen-tang": (g) => {
    [-1.3, 1.3].forEach((x) => put(g, K.rbox(0.5, 2.6, 0.5, 0.08, K.plastic(C.violet)), [x, 1.3, 0]));
    put(g, K.rbox(3.1, 0.35, 0.4, 0.08, K.plastic(C.coral)), [0, 2.75, 0]);
    const coin = K.mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.22, 64, 1, false, Math.PI / 4, Math.PI * 1.75), K.metal(C.gold, { roughness: 0.2 }));
    put(g, coin, [0, 1.25, 0.4], [R(70), R(25), 0]);
    const slice = K.mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.22, 32, 1, false, 0, Math.PI / 4), K.metal(C.gold, { roughness: 0.2 }));
    put(g, slice, [0.75, 2.05, 0.6], [R(70), R(25), R(-25)]);
  },
  "tim-khach-hang": (g) => {
    [[-1.6, 1.4, C.coralDeep], [-0.4, 2.0, C.violet], [0.8, 1.2, C.coralDeep], [2.0, 1.7, C.violet]].forEach(([x, h, c]) => {
      put(g, K.rbox(1.0, h, 1.0, 0.06, K.plastic(c)), [x, h / 2, -0.8]);
      put(g, K.rbox(1.1, 0.25, 0.3, 0.06, K.plastic(C.cream)), [x, h * 0.75, -0.25]);
    });
    put(g, K.paperPlane(C.cream), [-0.3, 3.2, 1.0], [R(-10), R(60), R(-12)], 1.0);
  },
  "lo-trinh-12-thang": (g) => {
    put(g, K.stairs(5), [-2.2, 0, 0], [0, R(-15), 0]);
    put(g, K.person(C.cream), [-0.4, 1.35, 0.6], [0, R(-30), 0], 0.55);
    put(g, K.cyl(0.04, 0.04, 1.4, K.metal()), [1.6, 2.95, -0.4]);
    put(g, K.rbox(0.7, 0.45, 0.04, 0.03, K.plastic(C.coral)), [1.95, 3.4, -0.4]);
  },
  "quan-tri-rui-ro": (g) => {
    put(g, K.umbrella(), [0, 0, 0], [0, 0, R(-8)], 1.0);
    put(g, K.laptop(K.dashTex()), [0.2, 0, 0.4], [0, R(-20), 0], 0.45);
    [[-1.8, 3.6], [1.6, 4.0], [-0.6, 4.4], [2.3, 3.0]].forEach(([x, y], i) => put(g, K.cone(0.28, 0.5, K.plastic(i % 2 ? C.cream : C.coral), 3), [x, y, 0.3], [0, 0, R(180 + i * 20)]));
  },
  "theo-doi-kinh-doanh": (g) => {
    put(g, K.panel(K.dashTex(), 4, 2.5), [0, 2.0, 0], [0, R(-14), 0]);
    put(g, K.funnel(), [-2.3, 0, 1.2], [0, 0, 0], 0.5);
  },
  "ke-hoach-30-ngay": (g) => {
    put(g, K.panel(K.calTex(), 2.2, 2.2, C.white), [-0.6, 1.4, 0], [R(-8), R(-15), 0]);
    put(g, K.rocket(), [1.7, 1.6, 0.6], [0, 0, R(-22)], 0.9);
    for (let i = 0; i < 6; i++) put(g, K.sphere(0.12 + i * 0.03, K.glow(C.orange, 1)), [1.2 - i * 0.12, 1.0 - i * 0.3, 0.6]);
  },

  /* ---------- Kênh US ---------- */
  "nhan-dinh-chien-luoc": (g) => {
    put(g, K.sign(), [0, 0, 0.4], [0, R(-15), 0]);
    put(g, K.rbox(0.9, 1.2, 0.9, 0.06, K.plastic(C.coralDeep)), [-2.2, 0.6, -0.8]);
    put(g, K.rbox(0.9, 1.6, 0.9, 0.06, K.plastic(C.coralDeep)), [-1.3, 0.8, -1.2]);
    put(g, K.tower(), [2.0, 0, -0.6], [0, 0, 0], 0.9);
  },
  "nam-ngach-noi-dung": (g) => {
    const tops = [K.sphere(0.25, K.plastic(C.coral)), K.cat(C.orange, { scarf: true }), K.rbox(0.5, 0.6, 0.5, 0.06, K.plastic("#2c1418")), K.cyl(0.08, 0.15, 0.7, K.plastic(C.cream)), K.bottle(C.violet)];
    [[-2.2, 2.6, C.coral, 1], [-1.0, 1.4, C.orange, 0.22], [0.3, 3.0, C.violet, 1], [1.5, 1.6, C.cream, 1], [2.6, 2.9, C.coralDeep, 0.3]].forEach(([x, y, c, s], i) => {
      tops[i].scale.setScalar(s);
      put(g, K.island(c, tops[i]), [x, y, -i * 0.1], [0, R(-20), 0], 0.65);
    });
  },
  "youtube-chinh-tiktok-phan-phoi": (g) => {
    put(g, K.panel(K.phoneUI("play"), 3.0, 1.7, "#1c080b"), [-0.5, 2.4, -0.4], [0, R(-12), 0]);
    put(g, K.phone(K.phoneUI("ad")), [2.1, 1.6, 0.6], [0, R(-22), R(5)], 0.75);
    [0, 1, 2].forEach((i) => put(g, K.sphere(0.07, K.glow(C.cream, 1.4)), [0.85 + i * 0.32, 1.5 - i * 0.08, 0.3]));
  },
  "concept-kenh": (g) => {
    put(g, K.sphere(0.9, K.glow(C.cream, 0.9)), [0, 2, 0]);
    [[C.coral, 0], [C.ink, 2.1], [C.violet, 4.2]].forEach(([c, a]) => put(g, K.reel(c === C.ink ? "#2c1418" : c), [Math.cos(a) * 2.0, 2 + Math.sin(a) * 0.7, Math.sin(a) * 1.2], [0, R(-20), 0], 0.65));
    put(g, K.torus(2.0, 0.02, K.glow(C.coral, 1)), [0, 2, 0], [R(75), 0, R(10)], [1, 1, 0.6]);
  },
  "kich-ban-mau": (g) => {
    put(g, K.panel(ms("window", { sky: sky.night, snow: true }), 2.6, 2.6, "#2c1418"), [0.3, 2.3, -0.8]);
    put(g, K.rbox(3.2, 0.2, 1.0, 0.06, K.plastic(C.white)), [0.3, 0.9, -0.3]);
    put(g, K.cat(C.orange), [0.5, 1.0, -0.2], [0, R(160), 0], 0.55);
    const lamp = new THREE.PointLight(C.orange, 30, 5);
    lamp.position.set(-1.5, 2.5, 1);
    g.add(lamp);
    put(g, K.sphere(0.3, K.glow(C.orange, 1.6)), [-1.7, 2.9, 0.4]);
  },
  "noi-dung-cho-khan-gia-my": (g) => {
    put(g, K.globe(), [-0.6, 2.0, 0], [R(15), R(30), 0], 1.0);
    put(g, K.phone(K.phoneUI("play")), [1.8, 1.8, 0.6], [0, R(-22), R(6)], 0.7);
    put(g, K.rbox(1.1, 0.7, 0.15, 0.3, K.plastic(C.cream)), [0.6, 3.6, 0.6], [0, R(-15), 0]);
  },
  "kiem-tien-tu-ai-content": (g) => {
    put(g, K.cyl(0.9, 0.75, 1.5, K.glass("#ffe9d6")), [0, 0.75, 0]);
    put(g, K.coins(5, C.gold), [0, 0.05, 0], [0, 0, 0], 1.2);
    [[-1.8, 2.8, C.coral], [-0.7, 3.4, C.violet], [0.7, 3.4, C.cream], [1.8, 2.8, C.orange]].forEach(([x, y, c]) => put(g, K.coins(2, c === C.cream ? C.gold : c), [x * 0.8, y - 0.4, 0.2], [R(35), 0, R(x * 12)], 0.8));
    put(g, K.cyl(0.4, 0.4, 0.12, K.glow(C.coral, 1.2)), [0, 3.0, -0.4], [Math.PI / 2, 0, 0]);
  },
  "lo-trinh-kenh-12-thang": (g) => {
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-2.6, 0.1, 1.5), new THREE.Vector3(-1.2, 0.1, 0.2), new THREE.Vector3(0.4, 0.1, 1.0), new THREE.Vector3(1.6, 0.1, -0.6), new THREE.Vector3(2.5, 0.1, -2)]);
    const pts = curve.getPoints(80);
    pts.forEach((p, i) => i % 2 === 0 && put(g, K.rbox(0.42, 0.08, 0.9, 0.03, K.plastic(i % 8 < 4 ? C.coralDeep : "#a8343a")), [p.x, 0.04, p.z], [0, Math.atan2(pts[Math.min(i + 1, 80)].x - p.x, pts[Math.min(i + 1, 80)].z - p.z), 0]));
    [0.08, 0.3, 0.52, 0.74, 0.92].forEach((t, i) => {
      const p = curve.getPoint(t);
      put(g, K.cyl(0.03, 0.03, 0.9, K.metal("#c7b9ad")), [p.x + 0.5, 0.45, p.z]);
      put(g, K.rbox(0.4, 0.26, 0.03, 0.03, K.plastic([C.coral, C.cream, C.violet, C.orange, C.coral][i])), [p.x + 0.7, 0.78, p.z]);
    });
    put(g, K.cyl(0.6, 0.6, 0.15, K.glow(C.coral, 1.4)), [2.6, 1.4, -2.1], [Math.PI / 2, 0, 0]);
    put(g, K.cone(0.22, 0.3, K.glow(C.white, 2), 3), [2.65, 1.4, -2.0], [0, 0, R(-90)]);
  },
  "hai-mo-hinh-xay-kenh": (g) => {
    put(g, K.cat(C.orange, { scarf: true }), [-2.0, 0, 0], [0, R(20), 0], 0.65);
    put(g, K.rbox(1.8, 0.12, 0.5, 0.06, K.plastic(C.cream)), [0, 1.0, 0], [0, 0, 0]);
    [[sky.violet, "person"], [sky.rain, "window"], [sky.warm, "bottle"], [sky.night, "cat"]].forEach(([s, k], i) => put(g, K.frame9(ms(k, { sky: s }), 0.48), [1.4 + (i % 2) * 0.75, 1.0 + Math.floor(i / 2) * 1.0, -0.2], [0, R(-15), R((i - 1.5) * 4)]));
  },
};

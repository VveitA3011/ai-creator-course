// Lớp lưu trữ trên trình duyệt. Mọi dữ liệu của học viên dùng khóa bắt đầu bằng "aic-".
// Mỗi lần ghi, khóa được đánh dấu là "đã đổi" để bộ đồng bộ biết cần đẩy lên tài khoản.

export const PREFIX = "aic-";
export const META_KEY = "aic-sync-meta";
export const LOCAL_CHANGE = "aic-local-change";
export const REMOTE_APPLIED = "aic-remote-applied";

export type SyncMeta = { userId: string | null; dirty: string[]; lastSync: string | null };
const emptyMeta: SyncMeta = { userId: null, dirty: [], lastSync: null };

function store(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readMeta(): SyncMeta {
  try {
    const m = JSON.parse(store()?.getItem(META_KEY) ?? "null");
    return m && Array.isArray(m.dirty) ? { ...emptyMeta, ...m } : { ...emptyMeta };
  } catch {
    return { ...emptyMeta };
  }
}

export function writeMeta(m: SyncMeta) {
  try {
    store()?.setItem(META_KEY, JSON.stringify(m));
  } catch {
    /* bỏ qua */
  }
}

export function readLocal(key: string): string | null {
  try {
    return store()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

/* Ghi do người học thao tác: đánh dấu khóa đã đổi và báo cho bộ đồng bộ */
export function writeLocal(key: string, value: string) {
  const s = store();
  if (!s) return;
  try {
    s.setItem(key, value);
    const m = readMeta();
    if (!m.dirty.includes(key)) writeMeta({ ...m, dirty: [...m.dirty, key] });
  } catch {
    return;
  }
  window.dispatchEvent(new CustomEvent(LOCAL_CHANGE, { detail: key }));
}

/* Toàn bộ dữ liệu của học viên trên trình duyệt này */
export function snapshot(): Record<string, string> {
  const s = store();
  const out: Record<string, string> = {};
  if (!s) return out;
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (k && k.startsWith(PREFIX) && k !== META_KEY) out[k] = s.getItem(k) ?? "";
  }
  return out;
}

/* Ghi dữ liệu lấy từ tài khoản về, không đánh dấu là đã đổi */
export function applySnapshot(data: Record<string, string>, opts: { replace?: boolean } = {}) {
  const s = store();
  if (!s) return;
  try {
    if (opts.replace) for (const k of Object.keys(snapshot())) if (!(k in data)) s.removeItem(k);
    for (const [k, v] of Object.entries(data)) if (k.startsWith(PREFIX) && k !== META_KEY) s.setItem(k, v);
  } catch {
    /* bỏ qua */
  }
  window.dispatchEvent(new Event(REMOTE_APPLIED));
  window.dispatchEvent(new Event("aic-progress"));
}

/* Xóa dữ liệu học viên khỏi trình duyệt (khi đăng xuất) */
export function clearLocal() {
  const s = store();
  if (!s) return;
  for (const k of Object.keys(snapshot())) s.removeItem(k);
  writeMeta({ ...emptyMeta });
  window.dispatchEvent(new Event(REMOTE_APPLIED));
  window.dispatchEvent(new Event("aic-progress"));
}

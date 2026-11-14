// Gộp dữ liệu trên trình duyệt với dữ liệu trong tài khoản. Hàm thuần, không chạm tới trình duyệt.
//
// Quy tắc:
// - Khóa người học chưa sửa từ lần đồng bộ trước: lấy bản trong tài khoản.
// - Khóa đã sửa trên máy này: giữ bản trên máy.
// - Riêng tiến độ bài học, ở lần đồng bộ đầu tiên của trình duyệt này với tài khoản: gộp cả hai nơi
//   để không mất bài đã học ở máy khác. Những lần sau, máy nào sửa thì lấy bản của máy đó
//   (để bỏ đánh dấu một bài vẫn có tác dụng).

export const PROGRESS_KEY = "aic-progress-v1";

function parseObj(s: string | undefined): Record<string, number> {
  try {
    const v = JSON.parse(s ?? "{}");
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  } catch {
    return {};
  }
}

export function mergeState(
  local: Record<string, string>,
  remote: Record<string, string>,
  dirty: string[],
  opts: { firstSync?: boolean } = {},
) {
  const merged: Record<string, string> = {};
  const keys = new Set([...Object.keys(local), ...Object.keys(remote)]);
  for (const k of keys) {
    const inLocal = k in local;
    const inRemote = k in remote;
    const isDirty = dirty.includes(k);
    if (inLocal && inRemote && isDirty && k === PROGRESS_KEY && opts.firstSync) {
      const a = parseObj(remote[k]);
      const b = parseObj(local[k]);
      const out: Record<string, number> = { ...a };
      for (const [id, t] of Object.entries(b)) out[id] = Math.max(Number(out[id] ?? 0), Number(t));
      merged[k] = JSON.stringify(out);
    } else if (inLocal && (isDirty || !inRemote)) {
      merged[k] = local[k];
    } else if (inRemote) {
      merged[k] = remote[k];
    }
  }
  return merged;
}

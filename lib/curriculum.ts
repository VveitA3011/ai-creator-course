export type Lesson = { slug: string; title: string; minutes: number };

export type Module = {
  slug: string;
  tag: string;
  title: string;
  summary: string;
  output: string;
  lessonCount: number;
  lessons: Lesson[];
};

export type Track = { tag: string; title: string; points: string[] };

// Thứ tự ở đây quyết định thứ tự học. Nội dung từng bài nằm ở content/<module>/<bài>.mdx.
export const modules: Module[] = [
  {
    slug: "module-0",
    tag: "Module 0",
    title: "Định hướng",
    summary: "Nghề AI Short-form Video Creator, 5 ngách thị trường, bộ công cụ và pipeline sản xuất.",
    output: "Bản tự đánh giá và ngách đã chọn",
    lessonCount: 4,
    lessons: [
      { slug: "nghe-ai-creator", title: "Nghề AI Short-form Video Creator", minutes: 12 },
      { slug: "tu-danh-gia-chon-ngach", title: "Tự đánh giá và chọn ngách", minutes: 20 },
      { slug: "bo-cong-cu", title: "Bộ công cụ tối thiểu", minutes: 12 },
      { slug: "pipeline-chuan-ban-giao", title: "Pipeline và chuẩn bàn giao", minutes: 15 },
    ],
  },
  {
    slug: "tuan-1",
    tag: "Tuần 1",
    title: "Tư duy biên kịch video ngắn",
    summary: "Hook 1–3 giây, cấu trúc quảng cáo và storytelling, voice-over, cao trào và CTA.",
    output: "6 kịch bản hoàn chỉnh, ít nhất 2 kịch bản có 3 phương án hook",
    lessonCount: 6,
    lessons: [
      { slug: "hook-3-giay-dau", title: "Hook trong 1–3 giây đầu", minutes: 15 },
      { slug: "cau-truc-quang-cao-ngan", title: "Cấu trúc video quảng cáo ngắn", minutes: 15 },
      { slug: "cau-truc-storytelling", title: "Cấu trúc video storytelling", minutes: 18 },
      { slug: "viet-voice-over", title: "Cách viết voice-over", minutes: 12 },
      { slug: "cao-trao-va-cta", title: "Cao trào và CTA", minutes: 12 },
      { slug: "tu-duy-hinh-anh", title: "Tư duy hình ảnh và bài tập 6 kịch bản", minutes: 20 },
    ],
  },
  {
    slug: "tuan-2",
    tag: "Tuần 2",
    title: "Visual Development và Storyboard",
    summary: "Thiết kế nhân vật, bối cảnh, ngôn ngữ máy quay, ánh sáng và storyboard.",
    output: "2 bộ storyboard, 1 character sheet, 1 bộ ảnh tham chiếu sản phẩm, thư viện prompt cơ bản",
    lessonCount: 5,
    lessons: [
      { slug: "thiet-ke-nhan-vat", title: "Character Design: thiết kế nhân vật", minutes: 18 },
      { slug: "thiet-ke-boi-canh", title: "Environment Design: thiết kế bối cảnh", minutes: 12 },
      { slug: "ngon-ngu-may-quay", title: "Camera Language: góc quay và chuyển động", minutes: 15 },
      { slug: "anh-sang-mau-sac", title: "Lighting: ánh sáng, tương phản, màu sắc", minutes: 12 },
      { slug: "storyboard", title: "Storyboard: sắp xếp chuỗi hình ảnh", minutes: 20 },
    ],
  },
  {
    slug: "tuan-3",
    tag: "Tuần 3",
    title: "Làm chủ Kling AI",
    summary: "Text-to-video, image-to-video, chuyển động camera, tham chiếu nhân vật, multi-shot và keyframe.",
    output: "12–15 đoạn video AI ngắn, một chuỗi cùng nhân vật, một video thử 15–20 giây",
    lessonCount: 7,
    lessons: [],
  },
  {
    slug: "tuan-4",
    tag: "Tuần 4",
    title: "Voice-over, âm thanh và CapCut",
    summary: "ElevenLabs, nhạc nền và hiệu ứng, cắt dựng theo nhịp thoại, phụ đề, color grading.",
    output: "Video hoàn chỉnh số 1: quảng cáo sản phẩm ngắn, khung dọc 9:16",
    lessonCount: 7,
    lessons: [],
  },
  {
    slug: "tuan-5",
    tag: "Tuần 5",
    title: "Thực chiến AI Video Advertising",
    summary: "Thương hiệu nước hoa giả lập: bản Cinematic Commercial và bản Social Media Advertisement.",
    output: "2 video quảng cáo, 2 bộ kịch bản, 2 storyboard, prompt và ảnh tham chiếu",
    lessonCount: 4,
    lessons: [],
  },
  {
    slug: "tuan-6",
    tag: "Tuần 6",
    title: "Thực chiến Storytelling và Animation",
    summary: "Phim ngắn chân thực “Bức thư gửi từ tương lai” và hoạt hình “Chuyến phiêu lưu của chú mèo nhỏ”.",
    output: "1 phim ngắn AI chân thực, 1 phim hoạt hình AI, 2 storyboard, 1 bộ character reference",
    lessonCount: 4,
    lessons: [],
  },
  {
    slug: "tuan-7",
    tag: "Tuần 7",
    title: "Hoàn thiện Portfolio",
    summary: "Chọn 5–6 sản phẩm tốt nhất, viết case study, ghi rõ dự án tự thực hiện.",
    output: "Trang portfolio công khai",
    lessonCount: 3,
    lessons: [],
  },
  {
    slug: "tuan-8",
    tag: "Tuần 8",
    title: "Đóng gói dịch vụ và bắt đầu nhận job",
    summary: "Ba gói khởi điểm: AI Script Package, AI Short Video, AI Video Series.",
    output: "3 gói dịch vụ có mô tả phạm vi và bàn giao",
    lessonCount: 3,
    lessons: [],
  },
  {
    slug: "final",
    tag: "Final Challenge",
    title: "The Last Letter",
    summary: "Phim ngắn AI chân thực 45–60 giây, storyboard 6–8 cảnh, xuất 9:16.",
    output: "Tự chấm đạt 80/100 trước khi đưa vào portfolio",
    lessonCount: 1,
    lessons: [],
  },
];

export const tracks: Track[] = [
  {
    tag: "Mở rộng A · 10 bài",
    title: "Freelance remote",
    points: [
      "Mô hình dịch vụ: quảng cáo, storytelling, repurposing",
      "Chọn khách hàng, đóng gói và định giá",
      "Tìm khách hằng tuần và lộ trình 12 tháng",
      "Quản trị rủi ro và 6 chỉ số kinh doanh",
    ],
  },
  {
    tag: "Mở rộng B · 9 bài",
    title: "Kênh TikTok/YouTube cho khán giả Mỹ",
    points: [
      "Chọn ngách nội dung và vai trò từng nền tảng",
      "Concept kênh, series và kịch bản mẫu",
      "Viết tiếng Anh tự nhiên, cấu trúc 60–90 giây",
      "Điều kiện kiếm tiền và khai báo nội dung AI",
    ],
  },
];

export const pipeline = [
  { step: "Brief", text: "Mục tiêu, người xem, nền tảng, thông điệp, CTA" },
  { step: "Kịch bản", text: "Concept, hook, phân cảnh, lời thoại" },
  { step: "Hình ảnh", text: "Nhân vật, sản phẩm, bối cảnh, ảnh tham chiếu" },
  { step: "Video AI", text: "Image-to-video, text-to-video, chuyển động" },
  { step: "Âm thanh", text: "Voice-over, nhạc, hiệu ứng" },
  { step: "Hậu kỳ", text: "Cắt dựng, phụ đề, màu, xuất 9:16" },
];

export const availableModules = modules.filter((m) => m.lessons.length > 0);

export type FlatLesson = Lesson & { module: Module; id: string; href: string };

export const flatLessons: FlatLesson[] = availableModules.flatMap((m) =>
  m.lessons.map((l) => ({
    ...l,
    module: m,
    id: `${m.slug}/${l.slug}`,
    href: `/khoa-hoc/${m.slug}/${l.slug}`,
  })),
);

export const totalPlanned = modules.reduce((n, m) => n + m.lessonCount, 0);

export function getModule(slug: string) {
  return modules.find((m) => m.slug === slug);
}

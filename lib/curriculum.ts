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

export const modules: Module[] = [
  {
    slug: "module-0",
    tag: "Module 0",
    title: "Định hướng",
    summary: "Nghề AI Short-form Video Creator, 5 ngách thị trường, bộ công cụ và pipeline sản xuất.",
    output: "Ngách, lĩnh vực sản phẩm và bộ công cụ đã chọn, tài khoản đã tạo",
    lessonCount: 4,
    lessons: [
      { slug: "nghe-ai-creator", title: "Nghề AI Short-form Video Creator", minutes: 12 },
      { slug: "tu-danh-gia-chon-ngach", title: "Chọn ngách theo dữ liệu thị trường", minutes: 20 },
      { slug: "bo-cong-cu", title: "Bộ công cụ tối thiểu", minutes: 12 },
      { slug: "pipeline-chuan-ban-giao", title: "Pipeline và chuẩn bàn giao", minutes: 15 },
    ],
  },
  {
    slug: "tuan-1",
    tag: "Tuần 1",
    title: "Tư duy biên kịch video ngắn",
    summary: "Hook 1–3 giây, cấu trúc quảng cáo và storytelling, voice-over, cao trào và CTA.",
    output: "Kịch bản LUNE 24 giây, kho 20 hook từ quảng cáo thật, kịch bản phim ngắn",
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
    output: "Storyboard LUNE 6 shot có ảnh khung đầu, character sheet, ảnh sản phẩm",
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
    output: "6 shot LUNE đã chọn lọc, Element nhân vật, bản ghép thô 24 giây, nhật ký credit",
    lessonCount: 7,
    lessons: [
      { slug: "text-to-video", title: "Text-to-Video: tạo video từ mô tả", minutes: 15 },
      { slug: "image-to-video", title: "Image-to-Video: cho ảnh tĩnh chuyển động", minutes: 15 },
      { slug: "camera-movement", title: "Điều khiển chuyển động camera", minutes: 15 },
      { slug: "character-reference", title: "Giữ nhân vật bằng ảnh tham chiếu", minutes: 18 },
      { slug: "multi-shot-keyframe", title: "Multi-shot và keyframe", minutes: 15 },
      { slug: "tao-chuoi-canh", title: "Thực hành tạo chuỗi cảnh", minutes: 25 },
      { slug: "chon-loc-sua-loi", title: "Chọn lọc, đánh giá và sửa lỗi", minutes: 15 },
    ],
  },
  {
    slug: "tuan-4",
    tag: "Tuần 4",
    title: "Voice-over, âm thanh và CapCut",
    summary: "ElevenLabs, nhạc nền và hiệu ứng, cắt dựng theo nhịp thoại, phụ đề, color grading.",
    output: "Gói giao LUNE hoàn chỉnh đạt 12 tiêu chí nghiệm thu",
    lessonCount: 7,
    lessons: [
      { slug: "voice-over-elevenlabs", title: "Tạo voice-over bằng ElevenLabs", minutes: 15 },
      { slug: "nhip-doc-cam-xuc", title: "Điều chỉnh nhịp đọc và cảm xúc", minutes: 12 },
      { slug: "nhac-nen-hieu-ung", title: "Nhạc nền và hiệu ứng âm thanh", minutes: 15 },
      { slug: "cat-dung-theo-nhip", title: "Cắt dựng theo nhịp thoại", minutes: 18 },
      { slug: "phu-de", title: "Chèn và chỉnh phụ đề", minutes: 12 },
      { slug: "keyframe-zoom", title: "Keyframe, zoom và chuyển động", minutes: 12 },
      { slug: "color-grading-xuat-video", title: "Color grading cơ bản và xuất video số 1", minutes: 20 },
    ],
  },
  {
    slug: "tuan-5",
    tag: "Tuần 5",
    title: "Thực chiến AI Video Advertising",
    summary: "Dự án thứ hai: bản Cinematic 24 giây và bản Social 16 giây với 3 hook để chạy thử quảng cáo.",
    output: "Thư mục giao khách: 1 video Cinematic, 3 video Social cùng thân khác hook, kịch bản, storyboard, ghi chú",
    lessonCount: 4,
    lessons: [
      { slug: "brief-va-concept", title: "Brief và concept cho thương hiệu nước hoa", minutes: 18 },
      { slug: "cinematic-commercial", title: "Phiên bản A: Cinematic Commercial", minutes: 25 },
      { slug: "social-media-ad", title: "Phiên bản B: Social Media Advertisement", minutes: 20 },
      { slug: "danh-gia-hai-phien-ban", title: "Nghiệm thu và đóng gói giao khách", minutes: 25 },
    ],
  },
  {
    slug: "tuan-6",
    tag: "Tuần 6",
    title: "Thực chiến Storytelling và Animation",
    summary: "Phim ngắn chân thực “Bức thư gửi từ tương lai” và hoạt hình “Chuyến phiêu lưu của chú mèo nhỏ”.",
    output: "1 phim ngắn AI chân thực, 1 phim hoạt hình AI, 2 storyboard, 1 bộ character reference",
    lessonCount: 4,
    lessons: [
      { slug: "buc-thu-kich-ban", title: "Bức thư gửi từ tương lai: kịch bản và storyboard", minutes: 20 },
      { slug: "buc-thu-san-xuat", title: "Bức thư gửi từ tương lai: sản xuất", minutes: 25 },
      { slug: "chu-meo-nhan-vat", title: "Chú mèo nhỏ: nhân vật 3D và thế giới", minutes: 20 },
      { slug: "chu-meo-san-xuat", title: "Chú mèo nhỏ: sản xuất, lồng tiếng, hậu kỳ", minutes: 25 },
    ],
  },
  {
    slug: "tuan-7",
    tag: "Tuần 7",
    title: "Hoàn thiện Portfolio",
    summary: "Chọn 5–6 sản phẩm tốt nhất, viết case study, ghi rõ dự án tự thực hiện.",
    output: "Trang portfolio công khai",
    lessonCount: 3,
    lessons: [
      { slug: "chon-san-pham", title: "Chọn 5–6 sản phẩm tốt nhất", minutes: 12 },
      { slug: "viet-case-study", title: "Viết case study 7 phần", minutes: 20 },
      { slug: "trinh-bay-portfolio", title: "Trình bày portfolio", minutes: 15 },
    ],
  },
  {
    slug: "tuan-8",
    tag: "Tuần 8",
    title: "Đóng gói dịch vụ và bắt đầu nhận job",
    summary: "Ba gói khởi điểm: AI Script Package, AI Short Video, AI Video Series.",
    output: "3 gói dịch vụ có mô tả phạm vi và bàn giao",
    lessonCount: 3,
    lessons: [
      { slug: "ba-goi-dich-vu", title: "Ba gói dịch vụ khởi điểm", minutes: 15 },
      { slug: "pham-vi-ban-giao", title: "Quy định phạm vi và bàn giao", minutes: 15 },
      { slug: "ho-so-tim-job", title: "Định vị hồ sơ và tìm job", minutes: 18 },
    ],
  },
  {
    slug: "final",
    tag: "Final Challenge",
    title: "The Last Letter",
    summary: "Phim ngắn AI chân thực 45–60 giây, storyboard 6–8 cảnh, xuất 9:16.",
    output: "Phim 45–60 giây đạt đủ 12 tiêu chí nghiệm thu, kèm case study",
    lessonCount: 1,
    lessons: [
      { slug: "the-last-letter", title: "Final Challenge: The Last Letter", minutes: 30 },
    ],
  },
];

export const extraModules: Module[] = [
  {
    slug: "freelance",
    tag: "Mở rộng A",
    title: "Freelance remote",
    summary: "Mô hình dịch vụ, khách hàng, giá, tìm khách, lộ trình 12 tháng và quản trị rủi ro.",
    output: "Kế hoạch kinh doanh cá nhân và 30 ngày hành động đầu tiên",
    lessonCount: 10,
    lessons: [
      { slug: "mo-hinh-kinh-doanh", title: "Mô hình kinh doanh cá nhân", minutes: 12 },
      { slug: "chon-khach-hang", title: "Chọn khách hàng mục tiêu", minutes: 12 },
      { slug: "dong-goi-va-gia", title: "Đóng gói dịch vụ và giá đề xuất", minutes: 18 },
      { slug: "co-cau-doanh-thu", title: "Cơ cấu doanh thu để đạt mục tiêu", minutes: 15 },
      { slug: "phi-nen-tang", title: "Phí nền tảng quốc tế", minutes: 10 },
      { slug: "tim-khach-hang", title: "Kế hoạch tìm khách hàng", minutes: 18 },
      { slug: "lo-trinh-12-thang", title: "Lộ trình doanh thu 12 tháng", minutes: 15 },
      { slug: "quan-tri-rui-ro", title: "Quản trị công việc và rủi ro", minutes: 15 },
      { slug: "theo-doi-kinh-doanh", title: "Hệ thống theo dõi kinh doanh", minutes: 12 },
      { slug: "ke-hoach-30-ngay", title: "Kế hoạch hành động 30 ngày đầu", minutes: 15 },
    ],
  },
  {
    slug: "kenh-us",
    tag: "Mở rộng B",
    title: "Kênh TikTok/YouTube cho khán giả Mỹ",
    summary: "Chọn ngách, vai trò từng nền tảng, concept kênh, kịch bản mẫu, kiếm tiền và lộ trình 12 tháng.",
    output: "Concept kênh, 3 series và lịch đăng 90 ngày",
    lessonCount: 9,
    lessons: [
      { slug: "nhan-dinh-chien-luoc", title: "Nhận định chiến lược: freelance và kênh riêng", minutes: 12 },
      { slug: "nam-ngach-noi-dung", title: "Năm ngách nội dung US nên thử", minutes: 15 },
      { slug: "youtube-chinh-tiktok-phan-phoi", title: "YouTube chính, TikTok phân phối", minutes: 15 },
      { slug: "concept-kenh", title: "Concept kênh và ba trụ cột nội dung", minutes: 15 },
      { slug: "kich-ban-mau", title: "Kịch bản mẫu: The Cat Who Waited", minutes: 15 },
      { slug: "noi-dung-cho-khan-gia-my", title: "Chiến lược nội dung cho khán giả Mỹ", minutes: 18 },
      { slug: "kiem-tien-tu-ai-content", title: "Kiếm tiền từ AI content", minutes: 15 },
      { slug: "lo-trinh-kenh-12-thang", title: "Lộ trình 12 tháng xây kênh", minutes: 12 },
      { slug: "hai-mo-hinh-xay-kenh", title: "Hai mô hình xây kênh", minutes: 12 },
    ],
  },
];

// Sổ tay công cụ: hướng dẫn từng bước cho từng công cụ, tra cứu khi cần. Đặt cuối để giữ số thứ tự ảnh bìa 1–63.
export const handbook: Module = {
  slug: "so-tay",
  tag: "Sổ tay",
  title: "Sổ tay công cụ",
  summary: "Hướng dẫn từng bước ChatGPT/Claude, ChatGPT Images, Kling, ElevenLabs, CapCut và cách quản lý tệp, credit, bản quyền.",
  output: "Bộ công cụ đã thiết lập, thư mục dự án chuẩn và bộ chỉ dẫn, prompt mẫu dùng lại được",
  lessonCount: 6,
  lessons: [
    { slug: "chatgpt-claude-bien-kich", title: "ChatGPT và Claude làm biên kịch: thiết lập và chuỗi prompt", minutes: 35 },
    { slug: "chatgpt-images", title: "ChatGPT Images: nhân vật nhất quán, sản phẩm, khung storyboard", minutes: 35 },
    { slug: "kling", title: "Kling AI từng bước: chế độ, thông số, nhân vật, multi-shot", minutes: 40 },
    { slug: "elevenlabs", title: "ElevenLabs từng bước: giọng, độ ổn định, audio tag, phát âm", minutes: 30 },
    { slug: "capcut", title: "CapCut Desktop từng bước: dựng, phụ đề, âm thanh, màu, xuất", minutes: 40 },
    { slug: "quan-ly-du-an", title: "Quản lý dự án: thư mục, đặt tên, credit, bản quyền", minutes: 20 },
  ],
};

export const allModules: Module[] = [...modules, ...extraModules, handbook];

export const pipeline = [
  { step: "Brief", text: "Mục tiêu, người xem, nền tảng, thông điệp, CTA" },
  { step: "Kịch bản", text: "Concept, hook, phân cảnh, lời thoại" },
  { step: "Hình ảnh", text: "Nhân vật, sản phẩm, bối cảnh, ảnh tham chiếu" },
  { step: "Video AI", text: "Image-to-video, text-to-video, chuyển động" },
  { step: "Âm thanh", text: "Voice-over, nhạc, hiệu ứng" },
  { step: "Hậu kỳ", text: "Cắt dựng, phụ đề, màu, xuất 9:16" },
];

export const availableModules = allModules.filter((m) => m.lessons.length > 0);

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

export const groups = [
  { key: "core", label: "Lộ trình lõi", short: "Lõi", href: "/lo-trinh", modules },
  { key: "freelance", label: "Freelance", short: "A", href: "/khoa-hoc/freelance", modules: [extraModules[0]] },
  { key: "us", label: "Kênh US", short: "B", href: "/khoa-hoc/kenh-us", modules: [extraModules[1]] },
];

export function getModule(slug: string) {
  return allModules.find((m) => m.slug === slug);
}

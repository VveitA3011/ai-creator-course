export type Tool = {
  slug: string;
  name: string;
  summary: string;
  lessons: { label: string; href: string }[];
  tone: "coral" | "cream" | "violet" | "orange" | "dark";
};

export const tools: Tool[] = [
  {
    slug: "kich-ban",
    name: "Dựng nhịp kịch bản",
    summary: "Chọn khung quảng cáo hoặc kể chuyện, điền hình ảnh và lời dẫn cho từng nhịp theo mốc giây, đếm từ so với thời lượng.",
    lessons: [
      { label: "Hook trong 1–3 giây đầu", href: "/khoa-hoc/tuan-1/hook-3-giay-dau" },
      { label: "Cấu trúc video storytelling", href: "/khoa-hoc/tuan-1/cau-truc-storytelling" },
    ],
    tone: "coral",
  },
  {
    slug: "storyboard",
    name: "Bảng storyboard",
    summary: "Mỗi shot đủ sáu cột, xem trước chuỗi khung 9:16, tự cộng thời lượng, cảnh báo shot quá dài và tạo sẵn prompt ảnh.",
    lessons: [
      { label: "Storyboard: sắp xếp chuỗi hình ảnh", href: "/khoa-hoc/tuan-2/storyboard" },
      { label: "Camera Language", href: "/khoa-hoc/tuan-2/ngon-ngu-may-quay" },
    ],
    tone: "violet",
  },
  {
    slug: "prompt",
    name: "Thư viện prompt",
    summary: "Lưu prompt theo bảy nhóm, lọc, tìm, sao chép một chạm. Sao lưu ra tệp để chuyển máy.",
    lessons: [
      { label: "Character Design", href: "/khoa-hoc/tuan-2/thiet-ke-nhan-vat" },
      { label: "Giữ nhân vật bằng ảnh tham chiếu", href: "/khoa-hoc/tuan-3/character-reference" },
    ],
    tone: "cream",
  },
  {
    slug: "checklist",
    name: "Checklist nghiệm thu",
    summary: "Mười hai mục kiểm tra đo được trước khi bàn giao bất kỳ video nào: định dạng, nhân vật, phụ đề, âm thanh, giấy phép.",
    lessons: [{ label: "Final Challenge: The Last Letter", href: "/khoa-hoc/final/the-last-letter" }],
    tone: "dark",
  },
  {
    slug: "thu-nhap",
    name: "Máy tính thu nhập",
    summary: "Nhập số khách, giá và giờ làm. Ra doanh thu, phần còn lại sau chi phí và thu nhập mỗi giờ.",
    lessons: [{ label: "Cơ cấu doanh thu để đạt mục tiêu", href: "/khoa-hoc/freelance/co-cau-doanh-thu" }],
    tone: "coral",
  },
];

export const qcItems =
  "Xuất đúng 1080×1920, 9:16, MP4 H.264, 30 fps|Tổng thời lượng đúng brief, lệch tối đa 1 giây|Khung hình đầu tiên đã là hook: chủ thể chính xuất hiện ngay giây 0|Nhân vật giữ cùng khuôn mặt, tóc, trang phục ở mọi shot (chụp màn hình các shot đặt cạnh nhau để so)|Không shot nào lộ lỗi tay, mặt hay vật thể biến dạng khi xem ở tốc độ thường|Sản phẩm đúng hình dáng, logo, màu theo ảnh khách gửi|Không có chữ do AI vẽ trong khung hình; chữ chỉ thêm ở khâu dựng|Phụ đề khớp 100% lời đọc, đúng chính tả, nằm trong vùng an toàn khoảng 900×1400 ở giữa|Lời dẫn nghe rõ trên loa điện thoại, nhạc thấp hơn lời rõ rệt|CTA hiện ít nhất 2 giây cuối và khớp mục tiêu trong brief|Đã xem bản xuất trên điện thoại ở cả TikTok, Reels, Shorts (chế độ nháp)|Đã lưu giấy phép nhạc, điều khoản công cụ và ghi chú khai báo AI";

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}

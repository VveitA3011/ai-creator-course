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
    slug: "cham-diem",
    name: "Thang điểm tự chấm",
    summary: "Sáu tiêu chí có trọng số, báo đạt khi từ 80/100 để đưa video vào portfolio.",
    lessons: [{ label: "Final Challenge: The Last Letter", href: "/khoa-hoc/final/the-last-letter" }],
    tone: "orange",
  },
  {
    slug: "checklist",
    name: "Checklist chất lượng",
    summary: "Mười hai mục kiểm tra trước khi bàn giao bất kỳ video nào.",
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
  "Hook đủ thu hút trong 1–3 giây đầu|Câu chuyện hoặc thông điệp rõ ràng, không lan man|Nhân vật nhất quán về khuôn mặt, tóc và trang phục|Bối cảnh, ánh sáng và màu sắc không thay đổi vô lý|Chuyển động tự nhiên, không có lỗi AI dễ nhận ra|Sản phẩm đúng hình dáng, logo và đặc điểm khách cung cấp|Voice-over rõ, không lệch khẩu hình nếu có thoại|Nhạc nền và hiệu ứng âm thanh phù hợp|Phụ đề chính xác, đồng bộ và nằm trong vùng an toàn|CTA phù hợp với mục tiêu video|Video xuất đúng tỷ lệ, độ phân giải và định dạng|Bản quyền tài sản và yêu cầu khai báo AI đã được kiểm tra";

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}

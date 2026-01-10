import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; // Import ngôn ngữ Tiếng Việt

dayjs.extend(relativeTime);
dayjs.locale('vi'); // Thiết lập sử dụng Tiếng Việt toàn cục

/**
 * Định dạng tiền tệ sang VNĐ
 * Ví dụ: 20000000 -> 20.000.000 ₫
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

/**
 * Định dạng thời gian còn lại sang Tiếng Việt
 * Ví dụ: "vài giây trước", "3 ngày tới", "25/12/2025 08:30"
 */
export const formatTimeLeft = (dateString) => {
  const date = dayjs(dateString);
  const now = dayjs();

  if (date.isBefore(now)) {
    return "Đã kết thúc";
  }

  const diffHours = date.diff(now, 'hour');

  // Nếu còn dưới 72 giờ thì hiển thị dạng "3 giờ tới" hoặc "1 ngày trước"
  if (diffHours < 72) {
    return date.fromNow();
  }
  // Nếu quá thời gian trên thì hiển thị định dạng ngày tháng VN
  return date.format('DD/MM/YYYY HH:mm');
};

/**
 * Định dạng ngày tháng năm đầy đủ
 * Ví dụ: 2025-12-25 -> 25/12/2025
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return '---';
  const formatStr = includeTime ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY';
  return dayjs(dateString).format(formatStr);
};

/**
 * Kiểm tra sản phẩm mới (Ví dụ: trong vòng 3 ngày kể từ khi tạo)
 */
export const isNewProduct = (createDate) => {
  const now = dayjs();
  const created = dayjs(createDate);
  // Trả về true nếu sản phẩm tạo trong vòng 72 giờ qua
  return now.diff(created, 'hour') < 72;
};
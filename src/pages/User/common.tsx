import { Tag } from "antd";

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ thanh toán",
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
  REFUNDED: "Đã hoàn tiền",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  COD: "Thanh toán khi nhận hàng",
  BANKING: "Chuyển khoản",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "default",
  CONFIRMED: "processing",
  PROCESSING: "purple",
  SHIPPING: "blue",
  DELIVERED: "green",
  CANCELLED: "red",
  PAID: "green",
  UNPAID: "red",
  REFUNDED: "blue",
  FAILED: "volcano",
};

export const renderTag = (value: string, labels: Record<string, string>) => (
  <Tag color={STATUS_COLORS[value] || "default"}>{labels[value] || value}</Tag>
);

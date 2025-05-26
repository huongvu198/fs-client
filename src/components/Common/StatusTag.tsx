import { Tag } from "antd";
import { OrderStatusEnum } from "../../shared/enum";

const statusMap: Record<OrderStatusEnum, { label: string; color: string }> = {
  [OrderStatusEnum.PENDING]: { label: "Chờ thanh toán", color: "orange" },
  [OrderStatusEnum.CONFIRMED]: {
    label: "Chờ giao hàng cho DVVC",
    color: "blue",
  },
  [OrderStatusEnum.PROCESSING]: { label: "Chờ xác nhận", color: "gold" },
  [OrderStatusEnum.SHIPPING]: { label: "Chờ giao hàng", color: "cyan" },
  [OrderStatusEnum.DELIVERED]: { label: "Đã giao hàng", color: "green" },
  [OrderStatusEnum.CANCELLED]: { label: "Đã huỷ", color: "red" },
};

const StatusTag = ({ status }: { status: OrderStatusEnum }) => {
  const { label, color } = statusMap[status] || {
    label: status,
    color: "default",
  };

  return (
    <Tag style={{ marginInlineEnd: 0 }} color={color}>
      {label}
    </Tag>
  );
};

export default StatusTag;

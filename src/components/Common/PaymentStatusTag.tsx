import { Tag } from "antd";
import { PaymentStatusEnum } from "../../shared/enum";

type Props = {
  status: PaymentStatusEnum;
};

const PAYMENT_STATUS_MAP: Record<
  PaymentStatusEnum,
  { color: string; label: string }
> = {
  [PaymentStatusEnum.PENDING]: {
    color: "orange",
    label: "Chờ thanh toán",
  },
  [PaymentStatusEnum.PAID]: {
    color: "green",
    label: "Đã thanh toán",
  },
  [PaymentStatusEnum.FAILED]: {
    color: "red",
    label: "Thất bại",
  },
  [PaymentStatusEnum.REFUNDED]: {
    color: "cyan",
    label: "Đã hoàn tiền",
  },
  [PaymentStatusEnum.UNPAID]: {
    color: "magenta",
    label: "Chưa thanh toán",
  },
};

const PaymentStatusTag = ({ status }: Props) => {
  const { color, label } = PAYMENT_STATUS_MAP[status];
  return <Tag color={color}>{label}</Tag>;
};

export default PaymentStatusTag;

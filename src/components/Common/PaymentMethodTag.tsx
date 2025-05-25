import { Tag } from "antd";
import { PaymentMethodEnum } from "../../shared/enum";

type Props = {
  method: PaymentMethodEnum;
};

const PAYMENT_METHOD_MAP: Record<
  PaymentMethodEnum,
  { color: string; label: string }
> = {
  [PaymentMethodEnum.COD]: {
    color: "green",
    label: "Thanh toán khi nhận hàng",
  },
  [PaymentMethodEnum.BANKING]: {
    color: "blue",
    label: "Chuyển khoản ngân hàng",
  },
};

const PaymentMethodTag = ({ method }: Props) => {
  const { color, label } = PAYMENT_METHOD_MAP[method];
  return <Tag color={color}>{label}</Tag>;
};

export default PaymentMethodTag;

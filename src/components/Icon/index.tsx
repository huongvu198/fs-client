import flagVN from "../../../public/svg/flagVietNam.svg";
import flagEN from "../../../public/svg/flagGlobal.svg";
import applePay from "../../../public/svg/applepay-svgrepo-com.svg";
import googlePay from "../../../public/svg/google-pay-primary-logo-logo-svgrepo-com.svg";
import masterCard from "../../../public/svg/mastercard-svgrepo-com.svg";
import paypal from "../../../public/svg/paypal-svgrepo-com.svg";
import visa from "../../../public/svg/visa-svgrepo-com.svg";
import { CSSProperties } from "react";
import Icon from "@ant-design/icons";

interface SvgProp {
  svgPath: string;
  width?: string | number;
  height?: string | number;
  fill?: string;
  className?: string;
}
interface IconProps {
  width?: string | number;
  height?: string | number;
  fill?: string;
  className?: string;
  style?: CSSProperties | undefined;
}
const SvgIcon = ({ svgPath, ...props }: SvgProp) => {
  return <Icon component={() => <img src={svgPath} {...props}></img>} />;
};
export const FlagVietNam = (props: IconProps) => (
  <SvgIcon svgPath={flagVN} {...props} />
);
export const FlagEN = (props: IconProps) => (
  <SvgIcon svgPath={flagEN} {...props} />
);
export const ApplePay = (props: IconProps) => (
  <SvgIcon svgPath={applePay} {...props} />
);
export const GooglePay = (props: IconProps) => (
  <SvgIcon svgPath={googlePay} {...props} />
);
export const Mastercard = (props: IconProps) => (
  <SvgIcon svgPath={masterCard} {...props} />
);
export const Paypal = (props: IconProps) => (
  <SvgIcon svgPath={paypal} {...props} />
);
export const Visa = (props: IconProps) => <SvgIcon svgPath={visa} {...props} />;

import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { Button } from "antd";
import { ButtonProps } from "antd/es/button";
const cx = classNames.bind(styles);

interface Props extends ButtonProps {
  isLoading?: boolean;
}

const ButtonComponent = ({
  isLoading = false,
  children,
  className,
  ...props
}: Props) => {
  return (
    <Button {...props} loading={isLoading} disabled={isLoading || props.disabled} className={className ? className : cx("button-component")}>
      {children}
    </Button>
  );
};

export default ButtonComponent;

import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import classNames from "classnames/bind";
import { JSX, useRef } from "react";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

interface IProps {
  fontSize?: number;
  children?: JSX.Element;
  isLoading?: boolean;
}

const Spinner = ({ fontSize = 24, children, isLoading = true }: IProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={cx("spiner")} ref={ref}>
      <Spin
        spinning={isLoading}
        indicator={<LoadingOutlined style={{ fontSize: fontSize }} spin />}
      >
        {children}
      </Spin>
    </div>
  );
};

export default Spinner;
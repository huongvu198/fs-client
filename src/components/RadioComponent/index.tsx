import { Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

interface RadioOption {
  id: string;
  label: string;
  isActive: boolean;
  inventory: number;
}

interface RadioComponentProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RadioComponent = ({
  options,
  value,
  onChange,
  className,
}: RadioComponentProps) => {
  const handleChange = (e: RadioChangeEvent) => {
    onChange(e.target.value);
  };

  return (
    <Radio.Group
      onChange={handleChange}
      value={value}
      className={cx("radio-group", className)}
    >
      {options.map((option) => (
        <Radio.Button
          key={option.id}
          value={option.id}
          className={cx("radio-button")}
          disabled={!option.isActive}
        >
          {option.label}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default RadioComponent;

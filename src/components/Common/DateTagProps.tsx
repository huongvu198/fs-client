import React from "react";
import { Tag } from "antd";
import { formatDateToVietnamese } from "../../shared/common";

interface DateTagProps {
  date: string | Date;
  color?: string;
}

const DateTag: React.FC<DateTagProps> = ({ date, color = "blue" }) => {
  return <Tag color={color}>{formatDateToVietnamese(date)}</Tag>;
};

export default DateTag;

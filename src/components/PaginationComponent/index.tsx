import { useEffect, useState } from "react";
import { Pagination } from "antd";

interface PaginationComponentProps {
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
}

const PaginationComponent = ({
  totalItems,
  pageSize,
  onPageChange,
}: PaginationComponentProps) => {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    onPageChange(current, pageSize);
  }, [current, pageSize]);

  const handleChange = (page: number, pageSize?: number) => {
    setCurrent(page);
    onPageChange(page, pageSize);
  };

  return (
    <Pagination
      current={current}
      total={totalItems}
      pageSize={pageSize}
      onChange={handleChange}
    />
  );
};

export default PaginationComponent;

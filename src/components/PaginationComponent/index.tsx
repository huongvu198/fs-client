import { useEffect, useState } from "react";
import { Pagination as AntPagination } from "antd";
import { Pagination as IPagination } from "interfaces/app.interface";

interface PaginationComponentProps {
  pagination: IPagination;
  onPageChange: (page: number, pageSize?: number) => void;
}

const PaginationComponent = ({
  pagination,
  onPageChange,
}: PaginationComponentProps) => {
  const [current, setCurrent] = useState(pagination.currentPage);

  useEffect(() => {
    setCurrent(pagination.currentPage);
  }, [pagination.currentPage]);

  const handleChange = (page: number, pageSize?: number) => {
    setCurrent(page);
    onPageChange(page, pageSize); // Gọi API để lấy dữ liệu trang mới
  };

  return (
    <AntPagination
      current={current}
      total={pagination.totalItems}
      pageSize={pagination.perPage}
      onChange={handleChange}
      showSizeChanger={false}
      disabled={pagination.totalItems === 0}
    />
  );
};

export default PaginationComponent;

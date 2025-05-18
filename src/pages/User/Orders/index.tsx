import { useEffect, useState } from "react";
import { Table, Modal, Image, Button } from "antd";
import { FormattedNumber } from "react-intl";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  renderTag,
} from "../common";
import { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import { cancelOrder, getOrderHistory } from "@redux/orderSlice";
import { useDispatch } from "react-redux";
import { ApiDispatch } from "@redux/index";
import { useReduxSelector } from "@hooks/useRedux";
import { Order } from "../../../interfaces/order.interface";
import DateTag from "@components/Common/DateTagProps";
import { OrderStatusEnum } from "shared/enum";

const OrdersHistoryPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch<ApiDispatch>();
  const { orderHistory, loading, pagination } = useReduxSelector(
    (state) => state.order
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "TT Đơn hàng",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (value: string) => renderTag(value, ORDER_STATUS_LABELS),
    },
    {
      title: "TT Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      render: (value: string) => renderTag(value, PAYMENT_STATUS_LABELS),
    },
    {
      title: "HT Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
      render: (value: string) => renderTag(value, PAYMENT_METHOD_LABELS),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (value: string) => (
        <FormattedNumber
          value={Number(value)}
          style="currency"
          currency="VND"
        />
      ),
    },
    {
      title: "TG Đặt hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => <DateTag date={value} />,
    },
    {
      title: "Tiện ích",
      key: "action",
      align: "center",
      render: (_, record: Order) => (
        <EyeOutlined onClick={() => handleViewDetail(record)} size={28} />
      ),
    },
  ];

  useEffect(() => {
    dispatch(getOrderHistory({ page: currentPage, perPage: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleCancelOrder = (orderId: string) => {
    dispatch(cancelOrder(orderId));
  };

  return (
    <>
      <Table
        bordered
        dataSource={orderHistory}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: pagination.totalItems,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
      />

      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?.id}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={
          selectedOrder?.status === OrderStatusEnum.PROCESSING ? (
            <Button danger onClick={() => handleCancelOrder(selectedOrder.id)}>
              Hủy đơn hàng
            </Button>
          ) : null
        }
      >
        {selectedOrder && (
          <div style={{ paddingTop: 10 }}>
            <div style={{ marginBottom: 16 }}>
              <p>
                <strong>Trạng thái đơn hàng:</strong>{" "}
                {renderTag(selectedOrder.status, ORDER_STATUS_LABELS)}
                {renderTag(selectedOrder.paymentStatus, PAYMENT_STATUS_LABELS)}
              </p>
              <p>
                <strong>Thanh toán:</strong>{" "}
                {renderTag(selectedOrder.paymentMethod, PAYMENT_METHOD_LABELS)}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                <FormattedNumber
                  value={Number(selectedOrder.total)}
                  style="currency"
                  currency="VND"
                />
              </p>
              <p>
                <strong>Ngày đặt:</strong>{" "}
                {<DateTag date={selectedOrder.createdAt} />}
              </p>
            </div>

            <h4>Sản phẩm</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: 12,
                    border: "1px solid #eee",
                    borderRadius: 8,
                    background: "#fafafa",
                  }}
                >
                  <Image
                    width={110}
                    height={110}
                    style={{
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                    src={item.variant?.images?.[0]?.url}
                    alt={item.productName}
                    preview={true}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: 4 }}>{item.productName}</h4>
                    <p style={{ margin: 0 }}>Size: {item.sizeValue}</p>
                    <p style={{ margin: 0 }}>Số lượng: {item.quantity}</p>
                    <p style={{ margin: 0 }}>
                      Giá sản phẩm:{" "}
                      {
                        <FormattedNumber
                          value={Number(item.price)}
                          style="currency"
                          currency="VND"
                        />
                      }
                    </p>
                    <p style={{ margin: 0 }}>
                      Thành tiền:{" "}
                      {
                        <FormattedNumber
                          value={Number(item.subtotal)}
                          style="currency"
                          currency="VND"
                        />
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selectedOrder.transactions && (
              <>
                <h4 style={{ marginTop: 24 }}>Giao dịch</h4>
                <div
                  style={{
                    background: "#f6ffed",
                    padding: 12,
                    borderRadius: 6,
                  }}
                >
                  <p>
                    <strong>Mã giao dịch:</strong>{" "}
                    {selectedOrder.transactions.data.code}
                  </p>
                  <p>
                    <strong>Ngân hàng:</strong>{" "}
                    {selectedOrder.transactions.data.gateway}
                  </p>
                  <p>
                    <strong>Số tài khoản:</strong>{" "}
                    {selectedOrder.transactions.data.accountNumber}
                  </p>
                  <p>
                    <strong>Ngày giao dịch:</strong>{" "}
                    {selectedOrder.transactions.data.transactionDate}
                  </p>
                  <p>
                    <strong>Số tiền:</strong>{" "}
                    {
                      <FormattedNumber
                        value={selectedOrder.transactions.data.transferAmount}
                        style="currency"
                        currency="VND"
                      />
                    }
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrdersHistoryPage;

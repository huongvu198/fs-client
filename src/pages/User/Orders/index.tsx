import { useEffect, useState } from "react";
import { Table, Modal, Button, Card, Col, Layout, Row } from "antd";
import { FormattedNumber } from "react-intl";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  renderTag,
} from "../common";
import { ColumnsType, TableProps } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import { cancelOrder, getOrderHistory } from "@redux/orderSlice";
import { useDispatch } from "react-redux";
import { ApiDispatch } from "@redux/index";
import { useReduxSelector } from "@hooks/useRedux";
import { Order, OrderItem } from "../../../interfaces/order.interface";
import DateTag from "@components/Common/DateTagProps";
import {
  OrderStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
  VoucherType,
} from "shared/enum";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { formatDateToVietnamese, formatPhoneInternal } from "shared/common";
import StatusTag from "@components/Common/StatusTag";
import PaymentMethodTag from "@components/Common/PaymentMethodTag";
import PaymentStatusTag from "@components/Common/PaymentStatusTag";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { PaymentDetailPath } from "@config/routerConfig";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const OrdersHistoryPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch<ApiDispatch>();
  const { orderHistory, loading, pagination } = useReduxSelector(
    (state) => state.order
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

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
    // {
    //   title: "TT Thanh toán",
    //   dataIndex: "paymentStatus",
    //   key: "paymentStatus",
    //   align: "center",
    //   render: (value: string) => renderTag(value, PAYMENT_STATUS_LABELS),
    // },
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

  const columnsItem: TableProps<OrderItem>["columns"] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizeValue",
      key: "sizeValue",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "center",

      render: (_, record) => (
        <FormattedNumber
          value={Number(record?.product.price)}
          style="currency"
          currency="VND"
        />
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "price",
      key: "price",
      align: "center",

      render: (_, record) => `${record?.product?.discount}%`,
    },
    {
      title: "Tổng Tiền",
      dataIndex: "subtotal",
      key: "subtotal",
      align: "center",
      render: (_, record) => (
        <FormattedNumber
          value={Number(record?.subtotal)}
          style="currency"
          currency="VND"
        />
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

  const handleCancelOrder = async (orderId: string) => {
    const resultAction = await dispatch(cancelOrder(orderId));

    if (cancelOrder.fulfilled.match(resultAction)) {
      setIsModalVisible(false);
    }
  };

  const isPaymentStillValid = (expiredAt: string | Date): boolean => {
    const localExpiredAt = dayjs(expiredAt).tz(dayjs.tz.guess());
    const now = dayjs();
    return now.isBefore(localExpiredAt);
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
        title={
          <div style={{ textAlign: "center", width: "100%" }}>
            Chi tiết đơn hàng
          </div>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1300}
        // bodyStyle={{
        //   minHeight: 600,
        // }}
        footer={[
          selectedOrder?.status === OrderStatusEnum.PROCESSING && (
            <Button
              key="cancel"
              danger
              onClick={() => handleCancelOrder(selectedOrder.id)}
            >
              Hủy đơn hàng
            </Button>
          ),
          selectedOrder?.status === OrderStatusEnum.PENDING &&
            selectedOrder.paymentMethod === PaymentMethodEnum.BANKING &&
            isPaymentStillValid(selectedOrder.paymentExpiredAt) && (
              <Button
                key="pay"
                type="primary"
                onClick={() =>
                  navigate(PaymentDetailPath.replace(":id", selectedOrder.id))
                }
              >
                Thanh toán
              </Button>
            ),
        ]}
      >
        <Layout
          style={{ background: "white", display: "flex", minHeight: "100%" }}
        >
          <Content style={{ marginRight: 16 }}>
            <Card
              type="inner"
              title={`Đơn hàng: ${selectedOrder?.id?.toUpperCase()}`}
              extra={<StatusTag status={selectedOrder?.status!} />}
              bodyStyle={{ background: "rgba(0, 0, 0, 0.02)", padding: 12 }}
              headStyle={{ borderBottom: "none", padding: 12 }}
            >
              Thời gian đặt hàng:{" "}
              {selectedOrder?.createdAt &&
                formatDateToVietnamese(selectedOrder.createdAt)}
            </Card>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Card
                    type="inner"
                    title="NGƯỜI NHẬN"
                    headStyle={{ color: "rgba(0, 0, 0, 0.50)", padding: 12 }}
                    style={{ flex: 1 }}
                    bodyStyle={{ padding: 12 }}
                  >
                    <h5
                      style={{
                        marginBottom: 8,
                        fontWeight: 600,
                        fontSize: 14,
                        marginTop: 0,
                      }}
                    >
                      {selectedOrder?.address?.fullName}
                    </h5>
                    <p style={{ marginBottom: 8, fontSize: 14 }}>
                      {selectedOrder &&
                        formatPhoneInternal(selectedOrder?.address?.phone)}
                    </p>
                    <p style={{ marginBottom: 0, fontSize: 14 }}>
                      {[
                        selectedOrder?.address?.street,
                        selectedOrder?.address?.ward,
                        selectedOrder?.address?.district,
                        selectedOrder?.address?.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </Card>
                </div>
              </Col>
            </Row>
            <Table
              bordered={true}
              columns={columnsItem}
              dataSource={selectedOrder?.items}
              style={{ marginTop: 16 }}
              pagination={false}
            />
          </Content>
          <Sider
            width="25%"
            style={{
              background: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Card
              type="inner"
              title="THANH TOÁN"
              headStyle={{ color: "rgba(0, 0, 0, 0.50)", padding: 12 }}
              bodyStyle={{ padding: 12 }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                    Thanh toán
                  </span>
                  <PaymentMethodTag
                    method={selectedOrder?.paymentMethod as PaymentMethodEnum}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                    Trạng thái thanh toán
                  </span>
                  <PaymentStatusTag
                    status={selectedOrder?.paymentStatus as PaymentStatusEnum}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                    Tổng hóa đơn:
                  </span>
                  <span>
                    <FormattedNumber
                      value={Number(selectedOrder?.subtotal)}
                      style="currency"
                      currency="VND"
                    />
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                    Voucher giảm giá :
                  </span>
                  <span>
                    <FormattedNumber
                      value={Number(
                        Number(selectedOrder?.subtotal ?? 0) -
                          Number(selectedOrder?.pointUsed ?? 0) -
                          Number(selectedOrder?.total ?? 0)
                      )}
                      style="currency"
                      currency="VND"
                    />
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                    Point giảm giá (1P ~ 1đ):
                  </span>
                  <span>
                    <FormattedNumber
                      value={Number(selectedOrder?.pointUsed || 0)}
                      style="currency"
                      currency="VND"
                    />
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                    Tổng thanh toán:
                  </span>
                  <span>
                    <FormattedNumber
                      value={Number(selectedOrder?.total)}
                      style="currency"
                      currency="VND"
                    />
                  </span>
                </div>
              </div>
            </Card>
            {selectedOrder?.voucher ? (
              <Card
                type="inner"
                headStyle={{ color: "rgba(0, 0, 0, 0.50)", padding: 12 }}
                bodyStyle={{ padding: 12 }}
                style={{ marginTop: 16 }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Mã giảm giá
                    </span>
                    <span>
                      {selectedOrder?.voucher?.type === VoucherType.FIXED ? (
                        <FormattedNumber
                          value={selectedOrder?.voucher?.discount}
                          style="currency"
                          currency="VND"
                        />
                      ) : (
                        `${selectedOrder?.voucher?.discount}%`
                      )}
                    </span>
                  </div>
                </div>
              </Card>
            ) : null}
            {selectedOrder?.paymentMethod === PaymentMethodEnum.BANKING &&
            selectedOrder.paymentStatus === PaymentStatusEnum.PAID ? (
              <Card
                type="inner"
                headStyle={{ color: "rgba(0, 0, 0, 0.50)", padding: 12 }}
                bodyStyle={{ padding: 12 }}
                style={{ marginTop: 16 }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Mã giao dịch
                    </span>
                    <span>{selectedOrder?.transactions?.data.code}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Ngân hàng
                    </span>
                    <span>{selectedOrder?.transactions?.data.gateway}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Số tài khoản
                    </span>
                    <span>
                      {selectedOrder?.transactions?.data.accountNumber}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Ngày giao dịch
                    </span>
                    <span>
                      {formatDateToVietnamese(
                        selectedOrder?.transactions?.data.transactionDate!
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: "rgba(0, 0, 0, 0.50)" }}>
                      Số tiền
                    </span>
                    <span>
                      <FormattedNumber
                        value={Number(
                          selectedOrder?.transactions?.data.transferAmount
                        )}
                        style="currency"
                        currency="VND"
                      />
                    </span>
                  </div>
                </div>
              </Card>
            ) : null}
          </Sider>
        </Layout>
      </Modal>
    </>
  );
};

export default OrdersHistoryPage;

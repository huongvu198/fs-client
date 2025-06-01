import { Link, useParams } from "react-router-dom";
import styles from "./index.module.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ApiDispatch } from "@redux/index";
import { orderDetail, paymentSuccess } from "@redux/orderSlice";
import { useReduxSelector } from "@hooks/useRedux";
import { OrderStatusEnum, PaymentMethodEnum, SocketEvent } from "shared/enum";
import dayjs from "dayjs";
import { Col, Row } from "antd";
import utc from "dayjs/plugin/utc";
import useSocket from "@hooks/useSocket";
import { useCountdown } from "@hooks/useCountDown";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { IOrderResponse } from "interfaces/order.interface";
import COD from "@assets/images/COD.jpg";
import { setIsOpenChat } from "@redux/appSlice";
import { setUserPoint } from "@redux/userSlice";

dayjs.extend(utc);

const PaymentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<ApiDispatch>();
  const { orderQr } = useReduxSelector((state) => state.order);
  const expireTime = orderQr?.order?.paymentExpiredAt;
  const timeLeft = useCountdown(expireTime);

  useEffect(() => {
    if (id) {
      dispatch(orderDetail({ orderId: id }));
    }
  }, [id]);

  useSocket({
    [SocketEvent.ORDER_PAYMENT_EXPIRED]: async (data: any) => {
      await dispatch(orderDetail({ orderId: data.order.id }));
    },
    [SocketEvent.PAYMENT_SUCCESSFUL]: async (data: any) => {
      await dispatch(paymentSuccess(data));
      dispatch(setUserPoint(data.order.pointUsed || 0));
    },
  });

  const PaymentStatusIcon = ({
    status,
  }: {
    status: "success" | "fail" | "pending";
  }) => {
    if (status === "success") {
      return (
        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 56 }} />
      );
    }

    if (status === "pending") {
      return (
        <ClockCircleTwoTone twoToneColor="#faad14" style={{ fontSize: 56 }} />
      );
    }

    return (
      <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 56 }} />
    );
  };

  const renderNotification = (orderQr: IOrderResponse) => {
    const { order } = orderQr;

    switch (order.paymentMethod) {
      case PaymentMethodEnum.BANKING:
        return (
          <div className={styles.notification}>
            <PaymentStatusIcon
              status={
                order.status === OrderStatusEnum.PROCESSING
                  ? "success"
                  : order.status === OrderStatusEnum.PENDING
                    ? "pending"
                    : "fail"
              }
            />
            <h2>
              {order.status === OrderStatusEnum.PROCESSING
                ? "Cảm ơn bạn đã thanh toán!"
                : order.status === OrderStatusEnum.PENDING
                  ? "Chờ thanh toán"
                  : "Thanh toán hết hạn"}
            </h2>
            <p>
              {order.status === OrderStatusEnum.PROCESSING ? (
                <>
                  <p>
                    Đơn hàng của bạn {order.id.toUpperCase()} đã được ghi
                    nhận.{" "}
                  </p>
                  <p>
                    <Link to="/">Tiếp tục mua sắm</Link>
                  </p>
                </>
              ) : order.status === OrderStatusEnum.PENDING ? (
                `Đơn hàng ${order.id.toUpperCase()} đang chờ thanh toán. Vui lòng hoàn tất thanh toán trước khi hết hạn.`
              ) : (
                <>
                  Đã xảy ra lỗi trong quá trình thanh toán. Thời gian thanh toán
                  đã hết hạn. Vui lòng{" "}
                  <Link
                    to="/"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    tạo đơn hàng mới{" "}
                  </Link>
                  hoặc nếu bạn đã thanh toán vui lòng{" "}
                  <Link
                    to="#"
                    onClick={(e) => {
                      dispatch(setIsOpenChat(true));
                      e.preventDefault();
                    }}
                  >
                    liên hệ hỗ trợ
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        );

      case PaymentMethodEnum.COD:
        return (
          <div className={styles.notification}>
            <PaymentStatusIcon
              status={
                order.status !== OrderStatusEnum.CANCELLED ? "success" : "fail"
              }
            />
            <h2>Đặt hàng thành công</h2>
            <p>
              {order.status !== OrderStatusEnum.CANCELLED ? (
                <>
                  <p>
                    Đơn hàng của bạn {order.id.toUpperCase()} đã được ghi
                    nhận.{" "}
                  </p>
                  <p>
                    <Link to="/">Tiếp tục mua sắm</Link>
                  </p>
                </>
              ) : null}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const renderContent = (
    paymentMethod: PaymentMethodEnum,
    orderQr: IOrderResponse,
    timeLeft: string
  ) => {
    switch (paymentMethod) {
      case PaymentMethodEnum.BANKING:
        const isPaymentSuccess =
          orderQr.order.status === OrderStatusEnum.PROCESSING;
        const isQrBlurred = timeLeft === "00:00:00" || isPaymentSuccess;

        return (
          <Row gutter={[16, 16]} className={styles.borderedRow}>
            <Col span={8} className={styles.borderedCol}>
              {orderQr &&
              timeLeft &&
              orderQr.order.paymentMethod === PaymentMethodEnum.BANKING ? (
                <div className={styles.qrWrapper}>
                  <div className={styles.qrImageContainer}>
                    <img
                      className={`${styles.qrImage} ${isQrBlurred ? styles.qrBlurred : ""}`}
                      src={orderQr.qr.data.qrDataURL}
                      alt="QR Code"
                    />
                    {isQrBlurred && <div className={styles.qrOverlay} />}
                  </div>
                  <div
                    className={`${styles.timerText} ${
                      isQrBlurred ? styles.timeOut : styles.timeLeft
                    }`}
                  >
                    {isPaymentSuccess
                      ? "Thanh toán thành công"
                      : `Thời gian còn lại: `}
                    {!isPaymentSuccess && <strong>{timeLeft}</strong>}
                  </div>
                </div>
              ) : null}
            </Col>

            <Col style={{ padding: 0 }} className={styles.lineCenter} />

            <Col
              span={15}
              className={`${styles.borderedCol} ${styles.leftCol}`}
            >
              {renderNotification(orderQr)}
            </Col>
          </Row>
        );

      case PaymentMethodEnum.COD:
        return (
          <Row gutter={[16, 16]} className={styles.borderedRow}>
            <Col span={8} className={styles.borderedCol}>
              <div className={styles.qrImageContainer}>
                <img className={styles.qrImage} src={COD} alt="QR Code" />
              </div>
            </Col>

            <Col style={{ padding: 0 }} className={styles.lineCenter} />
            <Col span={15} className={styles.borderedCol}>
              {renderNotification(orderQr)}
            </Col>
          </Row>
        );

      default:
        return <div>Phương thức thanh toán không xác định</div>;
    }
  };

  return (
    <div>
      <div className={styles.layout}>
        <h1 className={styles.pageTitle}>Chi tiết thanh toán</h1>
        <div className={styles.mainContent}>
          {orderQr?.order &&
            renderContent(orderQr.order.paymentMethod, orderQr, timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;

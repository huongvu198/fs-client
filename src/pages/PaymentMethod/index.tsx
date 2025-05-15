import React, { useEffect, useState } from "react";
import { Form, Modal, Radio } from "antd";
import styles from "./index.module.scss";
import OrderSummary from "@components/OrderSummaryComponent";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import useNotification from "@hooks/useNotification";
import { PaymentMethodEnum, SocketEvent } from "@constants/const";
import { useDispatch } from "react-redux";
import { clearOrderState, createOrder } from "@redux/orderSlice";
import { useReduxSelector } from "@hooks/useRedux";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import useSocket from "@hooks/useSocket";
import { useCartContext } from "contexts/cartContext";
import { clearCartData } from "@redux/cartSlice";
dayjs.extend(utc);

const PaymentMethod: React.FC = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState<string>("cod");
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const cartItems = location.state?.cart;
  const discountAmount = location.state?.discountAmount;
  const voucherType = location.state?.voucherType;
  const selectedPoint = location.state?.selectedPoint;
  const discountPercent = location.state?.discountPercent;
  const selectedAddress = location.state?.selectedAddress;
  const voucherId = location.state?.voucherId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { successMessage } = useNotification();
  const { setCart } = useCartContext();
  const { orderQr } = useReduxSelector(
    (state) => state.order
  );
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (values.paymentMethod === PaymentMethodEnum.COD) {
        successMessage({
          title: "Thanh toán",
          description: "Thanh toán thành công!",
        });
      } else {
        dispatch(
          createOrder({
            addressId: selectedAddress,
            paymentMethod: values.paymentMethod,
            point: selectedPoint === "point" ? "point" : "",
            ...(voucherId ? { voucherId } : {}),
          })
        );
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePaymentChange = (e: any) => {
    setSelectedPayment(e.target.value);
  };

  const { sendMessage } = useSocket(`${import.meta.env.VITE_URL_WEB_SOCKET}`, {
    [SocketEvent.ORDER_PAYMENT_EXPIRED]: async (data: any) => {
      console.log("🔥 [Handler Triggered] ORDER_PAYMENT_EXPIRED:", data);
      setTimeout(() => {
        Modal.confirm({
          centered: true,
          title: "Đơn hàng đã hết hạn",
          content: "Thời gian thanh toán đã kết thúc. Bạn có muốn quay lại trang chủ không?",
          okText: "Trang chủ",
          cancelText: "Huỷ",
          onOk() {
            dispatch(clearCartData())
            setCart({ id: "", items: [] });
            localStorage.removeItem("cartList");
            navigate("/");
            dispatch(clearOrderState());
          },
        });
      }, 0);
    },
    [SocketEvent.PAYMENT_SUCCESSFUL]: async (data: any) => {
      console.log("✅ Payment successful:", data);
      setTimeout(() => {
        Modal.confirm({
          centered: true,
          title: "Đơn hàng đã hết hạn",
          content: "Thời gian thanh toán đã kết thúc. Bạn có muốn quay lại trang chủ không?",
          okText: "Trang chủ",
          cancelText: "Huỷ",
          onOk() {
            navigate("/");
            dispatch(clearCartData())
            setCart({ id: "", items: [] });
            localStorage.removeItem("cartList");
          },
        });
      }, 0);
    },
  });

  useEffect(() => {
    if (
      orderQr &&
      orderQr.order.paymentExpiredAt &&
      selectedPayment === PaymentMethodEnum.BANKING
    ) {
      const updateTimeLeft = () => {
        const now = dayjs(); // không dùng utc nếu server đã trả ISO UTC
        const expireTime = dayjs(orderQr.order.paymentExpiredAt);
        const diff = Math.ceil(expireTime.diff(now, "second")); // làm tròn lên

        if (diff <= 0) {
          setTimeLeft("00:00:00");

          sendMessage(SocketEvent.ORDER_PAYMENT_EXPIRED, {
            orderId: orderQr.order.id,
            userId: orderQr.order.userId,
          });

          dispatch(clearOrderState());
          return false;
        } else {
          const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
          const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
          const seconds = String(diff % 60).padStart(2, "0");

          setTimeLeft(`${hours}:${minutes}:${seconds}`);
          return true;
        }
      };


      const shouldContinue = updateTimeLeft();
      let interval: number | null = null;
      if (shouldContinue) {
        interval = window.setInterval(() => {
          const keepGoing = updateTimeLeft();
          if (!keepGoing && interval !== null) {
            clearInterval(interval);
          }
        }, 1000);
      }
      return () => {
        if (interval !== null) clearInterval(interval);
      };
    }
  }, [orderQr, selectedPayment, sendMessage, dispatch]);

  return (
    <div>
      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>Payment method</h1>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ paymentMethod: PaymentMethodEnum.COD }}
            className={styles.formSection}
          >
            <Form.Item name="paymentMethod">
              <Radio.Group
                onChange={handlePaymentChange}
                value={selectedPayment}
                style={{ width: "100%" }}
              >
                <div
                  className={classNames(styles.paymentOption, {
                    [styles.selected]:
                      selectedPayment === PaymentMethodEnum.COD,
                  })}
                >
                  <Radio value={PaymentMethodEnum.COD}>
                    <div>
                      <div className={styles.paymentTitle}>COD</div>
                      <div className={styles.paymentDescription}>
                        Thanh toán khi nhận hàng
                      </div>
                    </div>
                  </Radio>
                </div>

                <div
                  className={classNames(styles.paymentOption, {
                    [styles.selected]:
                      selectedPayment === PaymentMethodEnum.BANKING,
                  })}
                >
                  <Radio
                    value={PaymentMethodEnum.BANKING}
                    disabled={selectedPoint === "point" ? true : false}
                  >
                    <div>
                      <div className={styles.paymentTitle}>Banking</div>
                      <div className={styles.paymentDescription}>
                        Chuyển khoản ngân hàng
                      </div>
                    </div>
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleSubmit}
              >
                Thanh toán
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleBack}
              >
                Trở về
              </button>
            </div>
          </Form>
          {timeLeft && (
            <div className={styles.timerText}>
              Thời gian còn lại: <strong>{timeLeft}</strong>
            </div>
          )}
          {orderQr && selectedPayment === PaymentMethodEnum.BANKING ? (
            <div className={styles.qrImageContainer}>
              <img width={350} src={orderQr.qr.data.qrDataURL} alt="QR Code" />
            </div>
          ) : null}
        </div>

        <div className={styles.sidebar}>
          <OrderSummary
            discountType={voucherType}
            cart={cartItems}
            discount={discountPercent}
            discountAmount={discountAmount}
            selectedPoint={selectedPoint}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;

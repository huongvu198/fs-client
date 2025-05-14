import React, { useEffect, useState } from "react";
import { Form, Radio } from "antd";
import styles from "./index.module.scss";
import OrderSummary from "@components/OrderSummaryComponent";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import useNotification from "@hooks/useNotification";
import { PaymentMethodEnum } from "@constants/const";
import { useDispatch } from "react-redux";
import { createOrder } from "@redux/orderSlice";
import { useReduxSelector } from "@hooks/useRedux";
import dayjs from "dayjs";
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
  const { errorMessage, successMessage } = useNotification();
  const { createOrderSuccess, orderQr } = useReduxSelector(
    (state) => state.order
  );
  console.log("🚀 ~ orderQr:", orderQr);
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

  useEffect(() => {
    if (
      orderQr &&
      orderQr.order.paymentExpiredAt &&
      selectedPayment === PaymentMethodEnum.BANKING
    ) {
      const interval = setInterval(() => {
        const now = dayjs();
        const expireTime = dayjs(orderQr.order.paymentExpiredAt);
        const diff = expireTime.diff(now, "second");
  
        if (diff <= 0) {
          setTimeLeft("00:00:00");
          clearInterval(interval);
  
          // 🔔 Bắn noti
          errorMessage({
            title: "Hết thời gian thanh toán",
            description: "Đơn hàng đã hết hạn. Bạn sẽ được chuyển về trang chủ sau 5s.",
          });
  
          // ⏳ Chờ 5 giây rồi quay về home
          setTimeout(() => {
            navigate("/");
          }, 5000);
        } else {
          const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
          const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
          const seconds = String(diff % 60).padStart(2, "0");
          setTimeLeft(`${hours}:${minutes}:${seconds}`);
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [orderQr, selectedPayment, errorMessage, navigate]);
  

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

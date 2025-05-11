import React, { useState } from "react";
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

const PaymentMethod: React.FC = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState<string>("cod");
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
          {orderQr && selectedPayment === PaymentMethodEnum.BANKING ? (
            <div className={styles.qrImageContainer}>
              <img width={350} src={orderQr.data.qrDataURL} alt="not image" />
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

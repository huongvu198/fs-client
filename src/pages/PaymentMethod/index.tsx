import React, { useState } from "react";
import { Form, Radio } from "antd";
import styles from "./index.module.scss";
import OrderSummary from "@components/OrderSummaryComponent";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createOrder } from "@redux/orderSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useCartContext } from "contexts/cartContext";
import { PaymentMethodEnum } from "shared/enum";
import { PaymentDetailPath } from "@config/routerConfig";
import { removeCartList, removeTempCart } from "shared/localStoreage";
import { clearCartData } from "@redux/cartSlice";
dayjs.extend(utc);

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
  const { setCart } = useCartContext();
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await dispatch(
        createOrder({
          addressId: selectedAddress,
          paymentMethod: values.paymentMethod,
          point: selectedPoint === "point" ? "point" : "",
          ...(voucherId ? { voucherId } : {}),
        })
      ).unwrap();

      navigate(PaymentDetailPath.replace(":id", response.order.id));
      removeCartList();
      removeTempCart();
      dispatch(clearCartData());
      setCart({ id: "", items: [] });
    } catch (error) {
      console.error("Thanh toán đơn hàng thất bại");
    }
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
        <h1 className={styles.pageTitle}>Hình thức thanh toán</h1>
        <div className={styles.layoutContent}>
          <div className={styles.mainContent}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{ paymentMethod: PaymentMethodEnum.COD }}
              className={styles.formSection}
            >
              <Form.Item name="paymentMethod" className={styles.formItem}>
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
    </div>
  );
};

export default PaymentMethod;

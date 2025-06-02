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
import { PaymentMethodEnum, SocketEvent } from "shared/enum";
import { PaymentDetailPath } from "@config/routerConfig";
import { removeCartList, removeTempCart } from "shared/localStoreage";
import { clearCartData, getCartByUserApi } from "@redux/cartSlice";
import useSocket from "@hooks/useSocket";
import { showToast, ToastType } from "shared/toast";
import { calculateCart } from "@utils/handleCart";
dayjs.extend(utc);

const PaymentMethod: React.FC = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState<string>("cod");

  const [discountAmount, setDiscountAmount] = useState(
    location.state?.discountAmount || 0
  );
  const [voucherType] = useState(location.state?.voucherType || null);
  const [selectedPoint] = useState(location.state?.selectedPoint || null);
  const [discountPercent] = useState(location.state?.discountPercent || 0);
  const [selectedAddress] = useState(location.state?.selectedAddress || null);
  const [voucherId] = useState(location.state?.voucherId || null);
  const [totalPayment, setTotalPayment] = useState(
    location.state?.totalPayment || 0
  );
  const [pointUsed, setPointUsed] = useState(location.state?.pointUsed || 0);
  const [cartItems, setCartItems] = useState(location.state?.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setCart } = useCartContext();

  useSocket({
    [SocketEvent.PRODUCT_PRICE_CHANGED]: (data) => {
      const productIdFromEvent = data.productId;

      // Tìm xem trong cartItems có sản phẩm nào có product.id trùng với productIdFromEvent không
      const productExistsInCart = cartItems?.items?.some(
        (item: any) => item.product?.id === productIdFromEvent
      );

      if (productExistsInCart) {
        showToast(
          ToastType.INFO,
          "Sản phẩm được cập nhật lại giá, vui lòng kiểm tra lại"
        );
        dispatch(getCartByUserApi())
          .unwrap()
          .then((cartData: any) => {
            setCartItems(cartData);

            const result = calculateCart({
              items: cartData.items,
              discount: discountPercent || 0,
              dataVoucher: {
                type: voucherType,
              },
              selectedPoint,
              pointRedux: pointUsed,
            });

            setDiscountAmount(result.discountAmount);
            setTotalPayment(result.totalPayment);
            setPointUsed(result.pointUsed);
          })
          .catch((err: any) => {
            console.error("Failed to fetch cart:", err);
          });
      }
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await dispatch(
        createOrder({
          addressId: selectedAddress,
          paymentMethod: values.paymentMethod,
          ...(selectedPoint ? { point: String(pointUsed) } : {}),
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
                      disabled={totalPayment <= 0}
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
              totalPayment={totalPayment}
              pointUsed={pointUsed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;

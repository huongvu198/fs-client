import React, { useState, useEffect } from "react";
import { Button, Input, Radio } from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  TagOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import { ICartResponse } from "interfaces/cart.interface";
import { hasAccessToken } from "@config/accessToken";
import { useDispatch, useSelector } from "react-redux";
import { useCartContext } from "contexts/cartContext";
import {
  acceptVoucherApi,
  addToCartApi,
  deleteCartItemApi,
  getPointAmount,
  getPointSelect,
  setReduxPointUsed,
} from "@redux/cartSlice";
import { FormattedNumber } from "react-intl";
import { useReduxSelector } from "@hooks/useRedux";
import { useNavigate } from "react-router-dom";
import { ShippingDetailPath } from "@config/routerConfig";
import { VoucherType } from "shared/enum";
import { showToast, ToastType } from "shared/toast";
import { getColors } from "@redux/appSlice";
import { getUserPoint } from "@redux/userSlice";

const cx = classNames.bind(styles);

const initialCartItems: ICartResponse = { id: "", items: [] };

const CartList = () => {
  const [cartItems, setCartItems] = useState<ICartResponse>(initialCartItems);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setCart } = useCartContext();

  const [subtotal, setSubtotal] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [pointUsed, setPointUsed] = useState<number>(
    useSelector(getPointAmount)
  );
  const { dataVoucher, loadingAppyVoucher } = useReduxSelector(
    (state) => state.cart
  );
  const [voucherType, setVoucherType] = useState<string>("");
  const [selectedPoint, setSelectePoint] = React.useState(
    useSelector(getPointSelect)
  );
  const [voucherId, setVoucherId] = React.useState("");

  const colorRedux = useReduxSelector(getColors);
  const pointRedux = useReduxSelector(getUserPoint);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  useEffect(() => {
    const calcSubtotal = cartItems.items.reduce(
      (sum, item) => sum + item.product.discountPrice * item.quantity,
      0
    );

    let calcDiscountAmount = 0;
    let calcTotal = calcSubtotal;

    if (discount > 0) {
      if (dataVoucher.type === VoucherType.PERCENT) {
        calcDiscountAmount = (calcSubtotal * discount) / 100;
        calcTotal = calcSubtotal - calcDiscountAmount;
      } else {
        calcDiscountAmount = discount;
        calcTotal = calcSubtotal - discount;
      }
    }

    if (selectedPoint) {
      const tempCalcTotal = calcTotal;
      calcTotal = calcTotal - Number(pointRedux);
      if (calcTotal <= 0) {
        calcTotal = 0;
        setPointUsed(tempCalcTotal);
      } else {
        calcTotal = calcTotal;
        setPointUsed(Number(pointRedux));
      }
    } else {
      calcTotal = calcTotal;
      setPointUsed(0);
    }
    setVoucherType(dataVoucher?.type);
    setSubtotal(calcSubtotal);
    setDiscountAmount(calcDiscountAmount);
    setTotalPayment(calcTotal);
  }, [cartItems, discount, dataVoucher, selectedPoint]);

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.items.find((i) => i.id === id);
    if (!item) return;

    const hasToken = hasAccessToken();

    if (!hasToken) {
      // Không có token => Chỉ update local và Context
      setCart((prevCart) => {
        if (!prevCart) return null;
        const updatedCart = {
          ...prevCart,
          items: prevCart.items.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          ),
        };
        localStorage.setItem("tempCart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        return updatedCart;
      });
    } else {
      // Có token => Gọi API addToCart
      try {
        const payload = {
          productId: item.product.id,
          sizeId: item.size.id,
          variantId: item.variant.id,
          quantity: newQuantity,
        };

        const updatedCart = await dispatch(addToCartApi(payload)).unwrap();
        setCart(updatedCart); // cập nhật context
        setCartItems(updatedCart); // cập nhật UI
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng sản phẩm", error);
      }
    }
  };

  const handleRemoveItem = async (id: string) => {
    const hasToken = hasAccessToken();

    if (!hasToken) {
      setCart((prevCart) => {
        if (!prevCart) return null;
        const updatedCart = {
          ...prevCart,
          items: prevCart.items.filter((item) => item.id !== id),
        };

        localStorage.setItem("tempCart", JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        return updatedCart;
      });
    } else {
      try {
        const updatedCart = await dispatch(deleteCartItemApi({ id })).unwrap();
        setCart(updatedCart);
        setCartItems(updatedCart);
        showToast(ToastType.SUCCESS, "Xóa thành công!");
      } catch (error) {
        showToast(ToastType.ERROR, "Lỗi khi xóa sản phẩm khỏi giỏ hàng!");
      }
    }
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
  };

  const applyPromoCode = async () => {
    const voucherRequest = {
      code: promoCode,
    };
    dispatch(acceptVoucherApi(voucherRequest));
  };

  const handleDoNext = () => {
    navigate(ShippingDetailPath, {
      state: {
        cartItems,
        totalPayment,
        pointUsed,
        selectedPoint,
        discount,
        voucherType,
        voucherId,
        discountAmount,
      },
    });
    dispatch(setReduxPointUsed({ amount: pointUsed, selected: selectedPoint }));
    setDiscountAmount(0);
  };

  useEffect(() => {
    if (dataVoucher) {
      if (dataVoucher.status) {
        setVoucherId(dataVoucher.id);
        setDiscount(dataVoucher.discount);
      } else {
        showToast(
          ToastType.INFO,
          dataVoucher.message || "Voucher không hợp lệ"
        );
      }
    }
  }, [dataVoucher]);

  useEffect(() => {
    const loadCart = () => {
      const localStorageKey = hasAccessToken() ? "cartList" : "tempCart";
      const localCart = localStorage.getItem(localStorageKey);

      if (localCart) {
        try {
          const parsedCart: ICartResponse = JSON.parse(localCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
        }
      }
    };

    loadCart();
  }, []);

  return (
    <>
      <div className={cx("cart-container")}>
        <h1 className={cx("cart-title")}>Giỏ hàng</h1>

        <div className={cx("cart-content")}>
          <div className={cx("cart-items")}>
            {cartItems.items.map((item) => (
              <div key={item.id} className={cx("cart-item")}>
                <div className={cx("product-image")}>
                  <img src={item.variant.image} alt={item.product.name} />
                </div>

                <div className={cx("product-details")}>
                  <h3 className={cx("product-name")}>{item.product.name}</h3>
                  <p className={cx("product-size")}>
                    Kích cỡ: {item.size.size}
                  </p>
                  <p className={cx("product-color")}>
                    Màu sắc:{" "}
                    {colorRedux?.find(
                      (color: any) =>
                        color.code.toLowerCase() ===
                        item.variant.color.toLowerCase()
                    )?.name || item.variant.color}
                  </p>
                  <p className={cx("product-price")}>
                    {item.product.discount > 0 ? (
                      <>
                        <span className={cx("original-price")}>
                          <FormattedNumber
                            value={item.product.price}
                            currency="VND"
                            style="currency"
                          />
                        </span>
                        <span className={cx("discounted-price")}>
                          <FormattedNumber
                            value={item.product.discountPrice}
                            currency="VND"
                            style="currency"
                          />
                        </span>
                      </>
                    ) : (
                      <FormattedNumber
                        value={item.product.price}
                        currency="VND"
                        style="currency"
                      />
                    )}
                  </p>
                </div>

                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  className={cx("remove-button")}
                  onClick={() => handleRemoveItem(item.id)}
                />
                <div className={cx("quantity-controls")}>
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className={cx("quantity-button")}
                  />
                  <span className={cx("quantity-display")}>
                    {item.quantity}
                  </span>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className={cx("quantity-button")}
                  />
                </div>
              </div>
            ))}

            {cartItems.items.length === 0 && (
              <div className={cx("empty-cart")}>
                <p>Your cart is empty</p>
              </div>
            )}
          </div>

          <div className={cx("order-summary")}>
            <h2 className={cx("summary-title")}>Đơn hàng</h2>

            <div className={cx("summary-row")}>
              <span>Tổng cộng</span>
              <span>
                <FormattedNumber
                  value={subtotal}
                  currency="VND"
                  style="currency"
                />
              </span>
            </div>
            {discount ? (
              <div className={cx("summary-row")}>
                {discount < 100 ? (
                  <>
                    <span>Voucher giảm giá ({discount}%)</span>
                    <span className={cx("discount-amount")}>
                      -
                      <FormattedNumber
                        value={discountAmount}
                        currency="VND"
                        style="currency"
                      />
                    </span>
                  </>
                ) : (
                  <>
                    <span>Voucher giảm giá</span>
                    <span className={cx("discount-amount")}>
                      -
                      <FormattedNumber
                        value={discountAmount}
                        currency="VND"
                        style="currency"
                      />
                    </span>
                  </>
                )}
              </div>
            ) : null}
            {selectedPoint && (
              <div className={cx("summary-row")}>
                <span>Point giảm giá (1P ~ 1đ)</span>
                <span className={cx("discount-amount")}>
                  -
                  <FormattedNumber
                    value={pointUsed}
                    currency="VND"
                    style="currency"
                  />
                </span>
              </div>
            )}

            <div className={cx("promoCode-container")}>
              <Input
                prefix={<TagOutlined />}
                placeholder="Nhập code giảm giá"
                value={promoCode}
                onChange={handlePromoCodeChange}
                className={cx("promo-input")}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                type="primary"
                onClick={applyPromoCode}
                className={cx("apply-button")}
                loading={loadingAppyVoucher}
              >
                Áp dụng
              </Button>
            </div>

            <div
              className={`${cx("point-option")} ${
                selectedPoint === true ? "selected" : ""
              }`}
              onClick={() => {
                if (selectedPoint) {
                  setSelectePoint(false);
                } else {
                  setSelectePoint(true);
                }
              }}
            >
              <Radio checked={selectedPoint}>
                <div>Sử dụng Point</div>
                <div style={{ fontSize: 12 }}>
                  {pointRedux.toLocaleString("vi-VN")} P
                </div>
              </Radio>
            </div>

            <div className={`${cx("summary-row")} ${cx("total-row")}`}>
              <span>Total</span>
              <span>
                <FormattedNumber
                  value={totalPayment}
                  currency="VND"
                  style="currency"
                />
              </span>
            </div>

            <Button
              type="primary"
              size="large"
              block
              className={cx("checkout-button")}
              disabled={cartItems.items.length === 0}
              onClick={handleDoNext}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartList;

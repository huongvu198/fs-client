import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  TagOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import BreadcrumbComponent from "@components/BreadCrumbComponent";
import { ICartResponse } from "interfaces/cart.interface";
import { hasAccessToken } from "@config/accessToken";
import { useDispatch } from "react-redux";
import { useCartContext } from "contexts/cartContext";
import {
  acceptVoucherApi,
  addToCartApi,
  deleteCartItemApi,
} from "@redux/cartSlice";
import useNotification from "@hooks/useNotification";
import { FormattedNumber } from "react-intl";
import { useReduxSelector } from "@hooks/useRedux";

const cx = classNames.bind(styles);

const breadCrumbItems = ["Cart"];
const initialCartItems: ICartResponse = { id: "", items: [] };

const CartList = () => {
  const [cartItems, setCartItems] = useState<ICartResponse>(initialCartItems);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const dispatch = useDispatch();
  const { setCart } = useCartContext();
  const { successMessage } = useNotification();

  const [subtotal, setSubtotal] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const { dataVoucher, loading } = useReduxSelector((state) => state.cart);

  useEffect(() => {
    const calcSubtotal = cartItems.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  
    let calcDiscountAmount = 0;
    let calcTotal = calcSubtotal;
  
    if (discount > 0) {
      if (dataVoucher.type === "PERCENT") {
        calcDiscountAmount = (calcSubtotal * discount) / 100;
        calcTotal = calcSubtotal - calcDiscountAmount;
      } else {
        calcDiscountAmount = discount;
        calcTotal = calcSubtotal - discount;
      }
    }
  
    setSubtotal(calcSubtotal);
    setDiscountAmount(calcDiscountAmount);
    setTotal(calcTotal);
  }, [cartItems, discount, dataVoucher]);

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
      // Không có token => Xóa local và cập nhật Context + State
      setCart((prevCart) => {
        if (!prevCart) return null;
        const updatedCart = {
          ...prevCart,
          items: prevCart.items.filter((item) => item.id !== id),
        };

        localStorage.setItem("tempCart", JSON.stringify(updatedCart));
        setCartItems(updatedCart); // <- Cập nhật state
        return updatedCart;
      });
    } else {
      // Có token => Gọi API xóa
      try {
        const updatedCart = await dispatch(deleteCartItemApi({ id })).unwrap();
        setCart(updatedCart);
        setCartItems(updatedCart); // <- Cập nhật state
        successMessage({ title: "Giỏ hàng", description: "Xóa thành công!" });
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng", error);
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

  useEffect(() => {
    if (dataVoucher) {
      setDiscount(dataVoucher.discount);
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
        <BreadcrumbComponent items={breadCrumbItems} />

        <h1 className={cx("cart-title")}>YOUR CART</h1>

        <div className={cx("cart-content")}>
          <div className={cx("cart-items")}>
            {cartItems.items.map((item) => (
              <div key={item.id} className={cx("cart-item")}>
                <div className={cx("product-image")}>
                  <img src={item.variant.image} alt={item.product.name} />
                </div>

                <div className={cx("product-details")}>
                  <h3 className={cx("product-name")}>{item.product.name}</h3>
                  <p className={cx("product-size")}>Size: {item.size.size}</p>
                  <p className={cx("product-color")}>
                    Color: {item.variant.color}
                  </p>
                  <p className={cx("product-price")}>
                    <FormattedNumber
                      value={item.product.price}
                      currency="VND"
                      style="currency"
                    />
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
            <h2 className={cx("summary-title")}>Order Summary</h2>

            <div className={cx("summary-row")}>
              <span>Subtotal</span>
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
                    <span>Discount (-{discount}%)</span>
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
                    <span>Discount Price</span>
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
            <div className={`${cx("summary-row")} ${cx("total-row")}`}>
              <span>Total</span>
              <span>
                <FormattedNumber
                  value={total}
                  currency="VND"
                  style="currency"
                />
              </span>
            </div>

            <div className={cx("promoCode-container")}>
              <Input
                prefix={<TagOutlined />}
                placeholder="Add promo code"
                value={promoCode}
                onChange={handlePromoCodeChange}
                className={cx("promo-input")}
              />
              <Button
                type="primary"
                onClick={applyPromoCode}
                className={cx("apply-button")}
                loading={loading}
              >
                Apply
              </Button>
            </div>

            <Button
              type="primary"
              size="large"
              block
              className={cx("checkout-button")}
              disabled={cartItems.items.length === 0}
            >
              Go to Checkout <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartList;

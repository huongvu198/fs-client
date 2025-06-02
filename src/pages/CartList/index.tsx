import React, { useState, useEffect } from "react";
import { Button, Empty, Radio, Select, Tag } from "antd";
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
  clearVoucher,
  deleteCartItemApi,
  getCartByUserApi,
  getPointAmount,
  getPointSelect,
  setReduxPointUsed,
} from "@redux/cartSlice";
import { FormattedNumber } from "react-intl";
import { useReduxSelector } from "@hooks/useRedux";
import { useNavigate } from "react-router-dom";
import { ProductDetailPath, ShippingDetailPath } from "@config/routerConfig";
import { DiscountType, SocketEvent } from "shared/enum";
import { showToast, ToastType } from "shared/toast";
import { getColors } from "@redux/appSlice";
import { getUserPoint } from "@redux/userSlice";
import NoDataIcon from "@components/Icon/NoData";
import { getVoucherAvailable, getVoucherRedux } from "@redux/voucherSlice";
import { Voucher } from "interfaces/order.interface";
import useSocket from "@hooks/useSocket";
import { calculateCart } from "@utils/handleCart";

const cx = classNames.bind(styles);

const initialCartItems: ICartResponse = { id: "", items: [] };

const CartList = () => {
  const [cartItems, setCartItems] = useState<ICartResponse>(initialCartItems);
  const [promoCode, setPromoCode] = useState<string | null>(null);
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
  const voucherRedux = useSelector(getVoucherRedux);
  const [voucherType, setVoucherType] = useState<string>("");
  const [selectedPoint, setSelectePoint] = React.useState(
    useSelector(getPointSelect)
  );
  const [voucherId, setVoucherId] = React.useState("");

  const colorRedux = useReduxSelector(getColors);
  const pointRedux = useReduxSelector(getUserPoint);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [vouchers, setVoucher] = useState<Voucher[]>([]);
  const [reload, setReload] = useState<boolean>(false);

  useSocket({
    [SocketEvent.PRODUCT_PRICE_CHANGED]: (data) => {
      const productIdFromEvent = data.productId;

      // Tìm xem trong cartItems có sản phẩm nào có product.id trùng với productIdFromEvent không
      const productExistsInCart = cartItems?.items?.some(
        (item) => item.product?.id === productIdFromEvent
      );

      if (productExistsInCart) {
        showToast(
          ToastType.INFO,
          "Sản phẩm được cập nhật lại giá, vui lòng kiểm tra lại"
        );
        setReload(!reload);
      }
    },
  });

  useEffect(() => {
    const result = calculateCart({
      items: cartItems.items,
      discount,
      dataVoucher,
      selectedPoint,
      pointRedux,
    });

    setSubtotal(result.subtotal);
    setDiscountAmount(result.discountAmount);
    setVoucherType(result.voucherType);
    setTotalPayment(result.totalPayment);
    setPointUsed(result.pointUsed);
  }, [cartItems, discount, dataVoucher, selectedPoint, pointRedux]);

  const handleQuantityChange = async (
    id: string,
    quantity: number,
    quantityChange: number
  ) => {
    const newQuantity = quantity + quantityChange;
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
          quantity: quantityChange,
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

  const handlePromoCodeSelectChange = (value: string) => {
    if (!value) {
      setPromoCode(null);
      setVoucherType("");
      setDiscount(0);
      dispatch(clearVoucher());
    } else {
      setPromoCode(value);
    }
  };

  const applyPromoCode = async (value: string) => {
    if (value) {
      const voucherRequest = {
        code: value,
      };
      dispatch(acceptVoucherApi(voucherRequest));
    }
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
          ToastType.ERROR,
          dataVoucher.message || "Voucher không hợp lệ"
        );
      }
    }
  }, [dataVoucher]);

  useEffect(() => {
    const loadCart = () => {
      // co login
      if (hasAccessToken()) {
        dispatch(getCartByUserApi())
          .unwrap()
          .then((cartData: any) => {
            setCartItems(cartData);
          })
          .catch((err: any) => {
            console.error("Failed to fetch cart:", err);
          });
      } else {
        const localCart = localStorage.getItem("tempCart");
        if (localCart) {
          const parsedCart: ICartResponse = JSON.parse(localCart);
          setCartItems(parsedCart);
        }
      }
    };
    dispatch(getVoucherAvailable());
    loadCart();
  }, [reload]);

  useEffect(() => {
    setVoucher(voucherRedux || []);
  }, [voucherRedux]);

  const options = vouchers?.map((v: Voucher) => ({
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{v.code}</span>
        <Tag
          color={v.type === DiscountType.PERCENT ? "blue" : "green"}
          style={{ marginLeft: 8 }}
        >
          {v.type === DiscountType.PERCENT
            ? `-${v.discount}%`
            : `-${v.discount.toLocaleString()}₫`}
        </Tag>
      </div>
    ),
    value: v.code,
  }));

  return (
    <>
      <div className={cx("cart-container")}>
        <h1 className={cx("cart-title")}>Giỏ hàng</h1>

        <div className={cx("cart-content")}>
          <div className={cx("cart-items")}>
            {cartItems.items.map((item) => (
              <div key={item.id} className={cx("cart-item")}>
                <div
                  className={cx("product-image")}
                  onClick={() =>
                    navigate(ProductDetailPath.replace(":id", item.product.id))
                  }
                  style={{ cursor: "pointer" }}
                >
                  <img src={item.variant.image} alt={item.product.name} />
                </div>

                <div className={cx("product-details")}>
                  <h3
                    className={cx("product-name")}
                    onClick={() =>
                      navigate(
                        ProductDetailPath.replace(":id", item.product.id)
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {item.product.name}
                  </h3>
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

                <div className={cx("quantity-controls")}>
                  <Button
                    icon={<MinusOutlined />}
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity, -1)
                    }
                    disabled={item.quantity <= 1}
                    className={cx("quantity-button")}
                  />
                  <span className={cx("quantity-display")}>
                    {item.quantity}
                  </span>
                  <Button
                    icon={<PlusOutlined style={{ fontSize: 18 }} />}
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity, 1)
                    }
                    className={cx("quantity-button")}
                  />
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  className={cx("remove-button")}
                  onClick={() => handleRemoveItem(item.id)}
                />
              </div>
            ))}

            {cartItems.items.length === 0 && (
              <div className={cx("empty-cart")}>
                <Empty
                  description="Giỏ hàng của bạn trống"
                  image={<NoDataIcon />}
                />
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
              <Select
                style={{ flex: 1, marginRight: 8 }}
                placeholder="Chọn code giảm giá"
                value={promoCode}
                onChange={handlePromoCodeSelectChange}
                options={options}
                allowClear
                prefix={
                  <TagOutlined style={{ paddingRight: 2, fontSize: 16 }} />
                }
                className={cx("promo-input")}
              />
              <Button
                type="primary"
                onClick={() => applyPromoCode(promoCode!)}
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
                  {pointRedux.toLocaleString("vi-VN")} Point
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

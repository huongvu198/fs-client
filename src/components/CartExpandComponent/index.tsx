import { useEffect, useState } from "react";
import { Drawer, Button, InputNumber, Divider, Badge, Empty } from "antd";
import { ShoppingCartOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import ButtonComponent from "@components/ButtonComponent";
import { hasAccessToken } from "@config/accessToken";
import { useCartContext } from "contexts/cartContext";
import { useReduxSelector } from "@hooks/useRedux";
import { CartPath, LoginPath } from "@config/routerConfig";
import { getColors } from "@redux/appSlice";
import NoDataIcon from "@components/Icon/NoData";

const cx = classNames.bind(styles);

const CartExpand = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { setCart, cart } = useCartContext();
  const dataCart = useReduxSelector((state) => state.cart.dataCart);
  const colorRedux = useReduxSelector(getColors);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleQuantityChange = (id: string, value: number | null) => {
    if (!value || !cart) return;

    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, quantity: value } : item
        ),
      };
    });
  };

  const getTotalAmount = () => {
    if (!cart) return 0;
    return cart.items.reduce(
      (total, item) => total + item.product.discountPrice * item.quantity,
      0
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const goToCart = () => {
    setVisible(false);
    navigate(CartPath);
  };

  const goToLogin = () => {
    setVisible(false);
    navigate(LoginPath);
  };

  useEffect(() => {
    if (dataCart && dataCart.items && dataCart.items.length > 0) {
      setCart(dataCart);
    } else {
      const localData = localStorage.getItem("tempCart");
      if (localData) {
        const parsedCart = JSON.parse(localData);
        if (parsedCart && parsedCart.items && parsedCart.items.length > 0) {
          setCart(parsedCart);
        } else {
          setCart({ id: "", items: [] });
        }
      } else {
        setCart({ id: "", items: [] });
      }
    }
  }, [dataCart, setCart]);

  return (
    <div className={cx("cart-container")}>
      <style>{`
        .ant-btn-variant-text:not(:disabled):not(.ant-btn-disabled):hover {
          background-color: transparent !important;
        }
      `}</style>
      <Badge size="small" count={cart?.items.length}>
        <Button
          type="text"
          icon={<ShoppingCartOutlined />}
          onClick={showDrawer}
          className={cx("cart-button")}
          size="small"
        />
      </Badge>

      <Drawer
        title={<div className={cx("drawer-title")}>Giỏ hàng</div>}
        placement="right"
        closable
        onClose={onClose}
        open={visible}
        closeIcon={<CloseOutlined />}
        width={320}
        footer={
          <div className={cx("drawer-footer")}>
            <ButtonComponent
              block
              onClick={goToCart}
              className={cx("view-cart-button")}
            >
              XEM GIỎ HÀNG
            </ButtonComponent>
            {!hasAccessToken() && (
              <ButtonComponent
                block
                onClick={goToLogin}
                className={cx("login-button")}
              >
                ĐĂNG NHẬP
              </ButtonComponent>
            )}
          </div>
        }
      >
        <div className={cx("cart-content")}>
          {cart?.items && cart.items.length > 0 ? (
            cart.items.map((item) => (
              <div key={item.id} className={cx("cart-item")}>
                <div className={cx("product-image")}>
                  <img src={item.variant.image} alt={item.product.name} />
                </div>
                <div className={cx("product-details")}>
                  <h4>{item.product.name}</h4>
                  <p className={cx("product-meta")}>
                    Màu sắc:{" "}
                    {colorRedux?.find(
                      (color: any) =>
                        color.code.toLowerCase() ===
                        item.variant.color.toLowerCase()
                    )?.name || item.variant.color}{" "}
                  </p>
                  <p className={cx("product-meta")}>
                    Kích cỡ: {item.size.size}
                  </p>
                  <div className={cx("quantity-control")}>
                    <InputNumber
                      min={1}
                      max={item.size.inventory}
                      value={item.quantity}
                      onChange={(value) => handleQuantityChange(item.id, value)}
                      controls
                      className={cx("quantity-input")}
                    />
                    <span className={cx("cart-price")}>
                      {formatPrice(item.product.discountPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Empty description="Không có sản phẩm" image={<NoDataIcon />} />
          )}
        </div>

        <Divider />
        {cart && (
          <div className={cx("cart-total")}>
            <span>Tổng cộng:</span>
            <span className={cx("cart-total-price")}>
              {formatPrice(getTotalAmount())}
            </span>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CartExpand;

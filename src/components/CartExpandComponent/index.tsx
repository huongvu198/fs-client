import { useEffect, useState } from "react";
import { Drawer, Button, InputNumber, Divider, Badge } from "antd";
import { ShoppingCartOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import ButtonComponent from "@components/ButtonComponent";
import { ICartResponse } from "interfaces/cart.interface";
import { hasAccessToken, hasLocalAccessToken } from "@config/accessToken";

const cx = classNames.bind(styles);

interface CartExpandProps {
  cartItems: ICartResponse;
  setCartItems: React.Dispatch<React.SetStateAction<ICartResponse>>;
}

const CartExpand = ({ cartItems, setCartItems }: CartExpandProps) => {
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const syncCartFromLocalStorage = () => {
      if (visible && !hasAccessToken() && !hasLocalAccessToken()) {
        const storedCart = localStorage.getItem("tempCart");
        if (storedCart) {
          try {
            const parsed = JSON.parse(storedCart);
            if (
              JSON.stringify(parsed.items) !== JSON.stringify(cartItems.items)
            ) {
              setCartItems(parsed);
            }
          } catch (err) {
            console.error("Giỏ hàng trong localStorage không hợp lệ", err);
            setCartItems({ id: "", items: [] });
          }
        }
      } else if (hasAccessToken() && hasLocalAccessToken()) {
        const cartList = localStorage.getItem("cartList");
        if (cartList) {
          try {
            const parsed = JSON.parse(cartList);
            if (
              JSON.stringify(parsed.items) !== JSON.stringify(cartItems.items)
            ) {
              setCartItems(parsed);
            }
          } catch (err) {
            console.error("Giỏ hàng người dùng không hợp lệ", err);
            setCartItems({ id: "", items: [] });
          }
        }
      }
    };

    syncCartFromLocalStorage();

    const interval = setInterval(syncCartFromLocalStorage, 1000);

    return () => clearInterval(interval);
  }, [visible, cartItems, setCartItems]);

  const handleQuantityChange = (id: string, value: number | null) => {
    if (!value) return;

    setCartItems((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, quantity: value } : item
      ),
    }));
  };

  const getTotalAmount = () => {
    return cartItems.items.reduce(
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
    navigate("/cartList");
  };

  const goToLogin = () => {
    setVisible(false);
    navigate("/login");
  };

  return (
    <div className={cx("cart-container")}>
      <Badge count={cartItems.items.length} size="small">
        <Button
          type="text"
          icon={<ShoppingCartOutlined />}
          onClick={showDrawer}
          className={cx("cart-button")}
          size="large"
        />
      </Badge>

      <Drawer
        title={
          <div className={cx("drawer-title")}>
            Giỏ hàng <Badge count={cartItems.items.length} />
          </div>
        }
        placement="right"
        closable={true}
        onClose={onClose}
        open={visible}
        closeIcon={<CloseOutlined />}
        width={320}
        footer={
          <div className={cx("drawer-footer")}>
            <ButtonComponent
              type="primary"
              block
              onClick={goToCart}
              className={cx("view-cart-button")}
            >
              XEM GIỎ HÀNG
            </ButtonComponent>
            <ButtonComponent
              block
              onClick={goToLogin}
              className={cx("login-button")}
            >
              ĐĂNG NHẬP
            </ButtonComponent>
          </div>
        }
      >
        <div className={cx("cart-content")}>
          {cartItems.items.map((item) => (
            <div key={item.id} className={cx("cart-item")}>
              <div className={cx("product-image")}>
                <img src={item.variant.image} alt={item.product.name} />
              </div>
              <div className={cx("product-details")}>
                <h4>{item.product.name}</h4>
                <p className={cx("product-meta")}>
                  Màu sắc: {item.variant.color} &nbsp; Size: {item.size.size}
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
          ))}
        </div>

        <Divider />
        <div className={cx("cart-total")}>
          <span>Tổng cộng:</span>
          <span className={cx("cart-total-price")}>
            {formatPrice(getTotalAmount())}
          </span>
        </div>
      </Drawer>
    </div>
  );
};

export default CartExpand;

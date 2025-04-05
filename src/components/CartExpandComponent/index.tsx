import { useState } from "react";
import { Drawer, Button, InputNumber, Divider, Badge } from "antd";
import { ShoppingCartOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import classNames from "classnames/bind";
import ButtonComponent from "@components/ButtonComponent";

const cx = classNames.bind(styles);

interface CartItem {
  id: number;
  name: string;
  description: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartExpandProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
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

  const handleQuantityChange = (id: number, value: number | null) => {
    if (!value) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: value } : item
      )
    );
  };

  const getTotalAmount = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-EN") + "$";
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
      <Badge count={cartItems.length} size="small">
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
            Giỏ hàng <Badge count={cartItems.length} />
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
            <ButtonComponent block onClick={goToLogin} className={cx("login-button")}>
              ĐĂNG NHẬP
            </ButtonComponent>
          </div>
        }
      >
        <div className={cx("cart-content")}>
          {cartItems.map((item) => (
            <div key={item.id} className={cx("cart-item")}>
              <div className={cx("product-image")}>
                <img src={item.image} alt={item.name} />
              </div>
              <div className={cx("product-details")}>
                <h4>
                  {item.name} - {item.description}
                </h4>
                <p className={cx("product-meta")}>
                  Màu sắc: {item.color} &nbsp; Size: {item.size}
                </p>
                <div className={cx("quantity-control")}>
                  <InputNumber
                    min={1}
                    max={10}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(item.id, value)}
                    controls
                    className={cx("quantity-input")}
                  />
                  <span className={cx("cart-price")}>
                    {formatPrice(item.price)}
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

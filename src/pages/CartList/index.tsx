// ShoppingCart.tsx
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
import Footer from "@components/FooterComponent";

const cx = classNames.bind(styles);

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

const breadCrumbItems = ["Cart"];
const initialCartItems: CartItem[] = [
  {
    id: "1",
    name: "Gradient Graphic T-shirt",
    price: 145,
    quantity: 1,
    image:
      "https://s3-alpha-sig.figma.com/img/f04a/017d/b094f9a20c2328f54a31b153619784f3?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=tYJyKcr6xdA9nfd6RDxQEkku5PtvQ44DC1rA7dwrW3GUl-EpC9McVqRsKjiVovY6m1etnJGPlnYUsjSQl6K7CfxNHuKgsP~vDCLIDwkVtoPcOZwS3u7dpuwq8RvZhyTRBl5jumVhqOaXtmr4B2RIA0zhqvkIt3RmW8GH7bbVr06U9KfEmRLiQSeOwX2JEjpdLlCY-~3IUer-kxqkJ3ZmHhgFv86mrEZV4C-NK~Ni0lOrKW0YDgHi3Qh4MiBRsudicoCN1p-HJbjvqrreGpZ59Ziazrwqmpv7-rgiW67DqXP9~VMlYUWPd77TN0bTH-IIKWj4N4uexf5eto-xVaWHZA__",
    size: "L",
    color: "White",
  },
  {
    id: "2",
    name: "Checkered Shirt",
    price: 180,
    quantity: 1,
    image:
      "https://s3-alpha-sig.figma.com/img/bbf4/11c2/5fc84f87eeac1062fbe47f49c192d4f2?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=cV0aTKe7ROcB7pIRD8--K7T37tbmfUyCeJHNSOamHdsDVLlLQwAdV1bna2u-lwnAJFJjY6Y6mcMq1m1dmM7Kx3dhyqRziiUqrsnFy0heyU3f-YTvLxpMknKWwPQhhNCJYZG8TPhzu95EjI7qe03FiD0xMdXMJ4WO19Nhf8JDG4D5xunC3eaGB7SRCqtjeqh2rCPfjvV~-28Wed6UOciZF6ceDhmaZxDhTfwqT1jripn0La9dBkQ~cWQV2BHA1M5U-bUAbwpAPHrvnjzd8BFjI3rhu~vNvGMsRnYB4XAI-5nfdBPgofN-vsbhlVUxw8wo5w91~HzxTfWlGZkS4xR30Q__",
    size: "M",
    color: "Red",
  },
  {
    id: "3",
    name: "Skinny Fit Jeans",
    price: 240,
    quantity: 1,
    image:
      "https://s3-alpha-sig.figma.com/img/769b/9d60/ff941dde9bc0e54431b8d8fe3182f5e9?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Nohd88fSNjXWI-rC6yIZbg0TjW5pASd7mVYH~IrJLOdQhkNVMnCXKYRaYUMq3uCq0AABDVxnBbR3muegY4ZEZmF-~cxCsVFfkSiCpKLelhfIfe~gOuVNZabxB96Pk7cDQhzqRbNt9AExvtIdnBp3YZr9~1Y-S5Ynbf1PkwQBpl7s8N9rL424M4x5Oh0dbbyjraRVJwXoRXJ4j2rHmkt~8Qctltag-We1Pk15ASG8aiEG8J7YZIOVN3McSF7u8Dx12I8ZLLhTeICtu0mAysUTGfFF5KMV7K33H7rHUchWPXjbvR~opc78JSj0h1FhR8XqCs4tSWrIyH2B8GNRQEGx7g__",
    size: "XL",
    color: "Blue",
  },
];

const CartList = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(20);
  const deliveryFee = 15;

  const [subtotal, setSubtotal] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const calcSubtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const calcDiscountAmount = (calcSubtotal * discount) / 100;
    const calcTotal = calcSubtotal - calcDiscountAmount + deliveryFee;

    setSubtotal(calcSubtotal);
    setDiscountAmount(calcDiscountAmount);
    setTotal(calcTotal);
  }, [cartItems, discount]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
  };

  const applyPromoCode = () => {
    if (promoCode.trim().length > 0) {
      setDiscount(25);
    }
  };

  return (
    <>
      <div className={cx("cart-container")}>
        <BreadcrumbComponent items={breadCrumbItems} />

        <h1 className={cx("cart-title")}>YOUR CART</h1>

        <div className={cx("cart-content")}>
          <div className={cx("cart-items")}>
            {cartItems.map((item) => (
              <div key={item.id} className={cx("cart-item")}>
                <div className={cx("product-image")}>
                  <img src={item.image} alt={item.name} />
                </div>

                <div className={cx("product-details")}>
                  <h3 className={cx("product-name")}>{item.name}</h3>
                  <p className={cx("product-size")}>Size: {item.size}</p>
                  <p className={cx("product-color")}>Color: {item.color}</p>
                  <p className={cx("product-price")}>${item.price}</p>
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

            {cartItems.length === 0 && (
              <div className={cx("empty-cart")}>
                <p>Your cart is empty</p>
              </div>
            )}
          </div>

          <div className={cx("order-summary")}>
            <h2 className={cx("summary-title")}>Order Summary</h2>

            <div className={cx("summary-row")}>
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>

            <div className={cx("summary-row")}>
              <span>Discount (-{discount}%)</span>
              <span className={cx("discount-amount")}>-${discountAmount}</span>
            </div>

            <div className={cx("summary-row")}>
              <span>Delivery Fee</span>
              <span>${deliveryFee}</span>
            </div>

            <div className={`${cx("summary-row")} ${cx("total-row")}`}>
              <span>Total</span>
              <span>${total}</span>
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
              >
                Apply
              </Button>
            </div>

            <Button
              type="primary"
              size="large"
              block
              className={cx("checkout-button")}
              disabled={cartItems.length === 0}
            >
              Go to Checkout <ArrowRightOutlined />
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartList;

import React from "react";
import styles from "./index.module.scss";
import { ICartResponse } from "interfaces/cart.interface";
import classNames from "classnames/bind";
import { VoucherType } from "shared/enum";

const cx = classNames.bind(styles);

interface OrderSummaryProps {
  cart: ICartResponse;
  discount: number;
  discountType: string;
  discountAmount: number;
  selectedPoint?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  discount,
  discountType,
  discountAmount,
  selectedPoint,
}) => {
  const formatCurrency = (amount: number | string) => {
    if (typeof amount === "string") return amount;
    return amount.toLocaleString("vi-VN") + "đ";
  };

  const calculateSubtotal = () => {
    return cart.items.reduce(
      (acc, item) => acc + item.product.discountPrice * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    if (selectedPoint === "point") {
      return 0;
    }
    const subtotal = calculateSubtotal();
    if (!discountAmount) discountAmount = 0;
    return subtotal - discountAmount;
  };

  return (
    <div className={cx("summary-container")}>
      <h2 className={cx("summary-title")}>Summary</h2>

      {cart.items.map((item) => (
        <div key={item.id} className={cx("summary-product-item")}>
          <div className={cx("summary-product-image")}>
            <img src={item.variant.image} alt={item.product.name} />
          </div>
          <div className={cx("summary-product-info")}>
            <div className={cx("summary-product-name")}>
              {item.product.name}
            </div>
            <div className={cx("product-detail")}>
              <span>Color: </span>{" "}
              <span
                className={cx("product-detail__color-circle")}
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  backgroundColor: item.variant.color,
                  borderRadius: "50%",
                  marginRight: 4,
                  verticalAlign: "middle",
                }}
              />
              | <span>Size: {item.size.size}</span>
            </div>
            <div className={cx("product-price")}>
              {formatCurrency(item.product.discountPrice)} x {item.quantity}
            </div>
          </div>
        </div>
      ))}

      <div className={cx("summary-divider")} />

      <div className={cx("summary-details")}>
        {selectedPoint === "point" ? (
          <div className={cx("summary-row")}>
            <span>Point Discount</span>
            <span>-{formatCurrency(calculateSubtotal())}</span>
          </div>
        ) : discountType === VoucherType.PERCENT ? (
          <>
            <div className={cx("summary-row")}>
              <span>Discount (-{discount}%)</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
            <div className={cx("summary-divider")} />
          </>
        ) : discountType === VoucherType.FIXED ? (
          <>
            <div className={cx("summary-row")}>
              <span>Discount Price</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
            <div className={cx("summary-divider")} />
          </>
        ) : null}
      </div>

      <div className={cx("summary-total-row")}>
        <span>TOTAL</span>
        <span>{formatCurrency(calculateTotal())}</span>
      </div>
    </div>
  );
};

export default OrderSummary;

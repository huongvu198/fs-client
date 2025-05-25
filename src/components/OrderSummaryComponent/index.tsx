import React from "react";
import styles from "./index.module.scss";
import { ICartResponse } from "interfaces/cart.interface";
import classNames from "classnames/bind";
import { VoucherType } from "shared/enum";
import { FormattedNumber } from "react-intl";
import { useReduxSelector } from "@hooks/useRedux";
import { getColors } from "@redux/appSlice";

const cx = classNames.bind(styles);

interface OrderSummaryProps {
  cart: ICartResponse;
  discount: number;
  discountType: string;
  discountAmount: number;
  selectedPoint?: string;
  totalPayment: number;
  pointUsed: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  discount,
  discountType,
  discountAmount,
  selectedPoint,
  totalPayment,
  pointUsed,
}) => {
  const colorRedux = useReduxSelector(getColors);

  return (
    <div className={cx("summary-container")}>
      <h2 className={cx("summary-title")}>Chi tiết</h2>

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
              <span>Màu sắc: </span>{" "}
              {colorRedux?.find(
                (color: any) =>
                  color.code.toLowerCase() === item.variant.color.toLowerCase()
              )?.name || item.variant.color}{" "}
              | <span>Kích cỡ: {item.size.size}</span>
            </div>
            <div className={cx("product-price")}>
              <span>Giá: </span>{" "}
              <FormattedNumber
                value={item.product.discountPrice}
                currency="VND"
                style="currency"
              />{" "}
              x {item.quantity}
            </div>
          </div>
        </div>
      ))}
      <div className={cx("summary-divider")} />

      <div className={cx("summary-details")}>
        {(discountType === VoucherType.PERCENT ||
          discountType === VoucherType.FIXED) && (
          <>
            <div className={cx("summary-row")}>
              <span>
                {discountType === VoucherType.PERCENT
                  ? `Voucher giảm giá (${discount}%)`
                  : "Voucher giảm giá"}
              </span>
              <span>
                -
                <FormattedNumber
                  value={discountAmount}
                  currency="VND"
                  style="currency"
                />
              </span>
            </div>
          </>
        )}
        {selectedPoint && (
          <div className={cx("summary-row")}>
            <span>Point giảm giá</span>
            <span>
              -
              <FormattedNumber
                value={pointUsed}
                currency="VND"
                style="currency"
              />
            </span>
          </div>
        )}
        <div className={cx("summary-divider")} />
      </div>

      <div className={cx("summary-total-row")}>
        <span>Tổng cộng</span>
        <span>
          {
            <FormattedNumber
              value={totalPayment}
              currency="VND"
              style="currency"
            />
          }
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;

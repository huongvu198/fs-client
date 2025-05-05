import React from "react";
import styles from "./index.module.scss";
import { ICartResponse } from "interfaces/cart.interface";
import classNames from "classnames/bind";
import { Button, Input } from "antd";
import { TagOutlined } from "@ant-design/icons";

const cx = classNames.bind(styles);
interface OrderSummaryProps {
  cart: ICartResponse;
  subtotal: number;
  shipping: string | number;
  taxes: number;
  total: number;
}

const fakeCartResponse: ICartResponse = {
    id: 'cart_fake_001',
    items: [
      {
        id: 'item_001',
        quantity: 2,
        status: 'AVAILABLE',
        product: {
          id: 'product_001',
          name: 'T-shirt Basic',
          price: 25.0,
          discount: 10, // 10%
          discountPrice: 22.5,
        },
        variant: {
          id: 'variant_001',
          color: 'Red',
          image: 'https://via.placeholder.com/150x150.png?text=T-shirt+Red',
        },
        size: {
          id: 'size_001',
          size: 'M',
          inventory: 50,
        },
      },
      {
        id: 'item_002',
        quantity: 1,
        status: 'AVAILABLE',
        product: {
          id: 'product_002',
          name: 'Hoodie Oversized',
          price: 50.0,
          discount: 20, // 20%
          discountPrice: 40.0,
        },
        variant: {
          id: 'variant_002',
          color: 'Black',
          image: 'https://via.placeholder.com/150x150.png?text=Hoodie+Black',
        },
        size: {
          id: 'size_002',
          size: 'L',
          inventory: 20,
        },
      },
    ],
    statusCode: 200,
    errorCode: undefined,
    message: 'Success',
  };
  
  
const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  subtotal,
  shipping,
  taxes,
  total,
}) => {
  const [voucherExpanded, setVoucherExpanded] = React.useState(false);
  const [voucherCode, setVoucherCode] = React.useState("");

  const formatCurrency = (amount: number | string) => {
    if (typeof amount === "string") return amount;
    return `$${amount.toFixed(2)}`;
  };

  const handlePromoCodeChange = () => {
    console.log("voucher change");
  }

  const applyPromoCode = () => {
    console.log("applyVoucher");
  }

  return (
    <div className={cx("summary-container")}>
      <h2 className={cx("summary-title")}>Summary</h2>

      {fakeCartResponse.items.map((item) => (
        <div key={item.id} className={cx("summary-product-item")}>
          <div className={cx("summary-product-image")}>
            <img
              src={"https://www.facebook.com/809cc77b-aacd-4107-969c-a3f01927a97d"}
              alt="/api/placeholder/60/60"
            />
          </div>
          <div className={cx("summary-product-info")}>
            <div className={cx("summary-product-name")}>
              {item.product.name}
            </div>
            <div className={cx("product-detail")}>
              <span>Color: {item.variant.color}</span> |{" "}
              <span>Size: {item.size.size}</span>
            </div>
            <div className={cx("product-price")}>
              {formatCurrency(item.product.discountPrice || item.product.price)}{" "}
              x {item.quantity}
            </div>
          </div>
        </div>
      ))}

      <div className={cx("summary-divider")} />

      <div
        className={cx("summary-voucher-selection")}
        onClick={() => setVoucherExpanded(!voucherExpanded)}
      >
        <span>HAVE A VOUCHER?</span>
        <span>{voucherExpanded ? "▲" : "▼"}</span>
      </div>

      {voucherExpanded && (
        <div className={cx("promoCode-container")}>
        <Input
          prefix={<TagOutlined />}
          placeholder="Add promo code"
          value={voucherCode}
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
      )}

      <div className={cx("summary-divider")} />

      <div className={cx("summary-details")}>
        <div className={cx("summary-row")}>
          <span>SUBTOTAL</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className={cx("summary-row")}>
          <span>SHIPPING</span>
          <span>
            {shipping === "FREE" ? "FREE" : formatCurrency(Number(shipping))}
          </span>
        </div>
        <div className={cx("summary-row")}>
          <span>TAXES</span>
          <span>{formatCurrency(taxes)}</span>
        </div>
      </div>

      <div className={cx("summary-divider")} />

      <div className={cx("summary-total-row")}>
        <span>TOTAL</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;

import { VoucherType } from "shared/enum";

interface CartItem {
  product: {
    discountPrice: number;
    discount: number;
    price: number;
  };
  quantity: number;
}

interface CartCalculationInput {
  items: CartItem[];
  discount: number;
  dataVoucher: {
    type?: string;
  } | null;
  selectedPoint: boolean;
  pointRedux: number | string;
}

interface CartCalculationResult {
  subtotal: number;
  discountAmount: number;
  voucherType: string;
  totalPayment: number;
  pointUsed: number;
}

export function calculateCart(
  input: CartCalculationInput
): CartCalculationResult {
  const { items, discount, dataVoucher, selectedPoint, pointRedux } = input;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.discountPrice * item.quantity,
    0
  );

  let discountAmount = 0;
  let total = subtotal;

  if (discount > 0) {
    if (dataVoucher?.type === VoucherType.PERCENT) {
      discountAmount = (subtotal * discount) / 100;
      total = subtotal - discountAmount;
    } else {
      discountAmount = discount;
      total = subtotal - discount;
    }
  }

  let pointUsed = 0;

  if (selectedPoint) {
    const tempTotal = total;
    total = total - Number(pointRedux);

    if (total <= 0) {
      total = 0;
      pointUsed = tempTotal;
    } else {
      pointUsed = Number(pointRedux);
    }
  }

  return {
    subtotal,
    discountAmount,
    voucherType: dataVoucher?.type || "",
    totalPayment: total,
    pointUsed,
  };
}

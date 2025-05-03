export enum EPopupMode {
  ADD = "ADD",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  VIEW = "VIEW",
}

export enum OrderStatusEnum {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethodEnum {
  COD = "COD",
  BANKING = "BANKING",
}

export enum PaymentStatusEnum {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  UNPAID = "UNPAID",
}

export enum DiscountType {
  PERCENT = "PERCENT",
  FIXED = "FIXED",
}

import { OrderStatusEnum } from "shared/enum";

export interface VariantImage {
  id: string;
  url: string;
  variantId: string;
}

export interface Variant {
  id: string;
  color: string;
  isActive: boolean;
  productId: string;
  images: VariantImage[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  isArchived: boolean;
  discount: number;
  totalQuantity: number;
  totalSoldQuantity: number;
  totalInventory: number;
  segmentId: string;
  categoryId: string;
  subCategoryId: string;
  averageRating: string;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productPrice: string;
  variantId: string;
  color: string;
  sizeId: string;
  sizeValue: string;
  quantity: number;
  price: string;
  subtotal: string;
  createdAt: string;
  updatedAt: string;
  isReviewed: boolean;

  product: Product;
  variant: Variant;
  review: ReviewItem | null;
}

export interface ReviewItem {
  id: string;
  orderItemId: string;
  userId: number;
  productId: string;
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  type: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  quantity: number | null;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TransactionData {
  id: number;
  code: string;
  content: string;
  gateway: string;
  subAccount: string | null;
  accumulated: number;
  description: string | null;
  transferType: string;
  accountNumber: string;
  referenceCode: string;
  transferAmount: number;
  transactionDate: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  data: TransactionData;
  orderId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: number;
  addressId: string;
  voucherId: string | null;
  subtotal: string;
  discount: string;
  total: string;
  status: OrderStatusEnum;
  paymentMethod: string;
  paymentStatus: string;
  note: string | null;
  transactionId: string | null;
  code: string;
  createdAt: string;
  updatedAt: string;
  paymentExpiredAt: string;
  items: OrderItem[];
  voucher: Voucher | null;
  address: any | null;
  transactions: Transaction | null;
  pointUsed: number;
}

export interface QRCode {
  qrCode: string;
  qrDataURL: string;
}

export interface QR {
  code: string;
  desc: string;
  data: QRCode;
}

export interface IOrderReq {
  addressId: string;
  voucherId?: string;
  paymentMethod: string;
  point?: string;
}

export interface IOrderResponse {
  type: string;
  order: Order;
  qr: QR;
}

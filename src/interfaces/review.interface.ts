export interface User {
  id: number;
  fullName: string;
  email: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  variantId: string;
  color: string;
  size: string;
  quantity: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: User;
  orderItem: OrderItem;
}

export interface CreateReviewDto {
  orderItemId: string;
  rating: number;
  comment: string;
}

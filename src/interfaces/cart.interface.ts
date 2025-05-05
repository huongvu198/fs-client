export interface ICart {
  productId: string;
  variantId: string;
  sizeId: string;
  quantity: number;
  productName?: string;
  size?: string;
  colorName?: string;
  price?: number;
  discountPrice?: number;
  image?: string;
}

export interface CartRequest {
  productId: string;
  variantId: string;
  sizeId: string;
  quantity: number;
}

export interface ICartResponse {
  id?: string;
  items: ItemsCart[];
  errorCode?: string;
  message?: string;
  statusCode?: number;
}

export interface ItemsCart {
  id: string;
  quantity: number;
  status: string;
  product: ProductCart;
  variant: Variant;
  size: Size;
}

interface ProductCart {
  id: string;
  name: string;
  price: number;
  discount: number;
  discountPrice: number;
}

interface Variant {
  id: string;
  color: string;
  image: string;
}

interface Size {
  id: string;
  size: string;
  inventory: number;
}

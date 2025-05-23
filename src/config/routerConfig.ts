export const ProductsPath = "/products";
export const ProductsQueryPath = ({
  tag,
  segment,
  search,
  category,
  subcategory,
}: {
  tag?: string;
  segment?: string;
  search?: string;
  category?: string;
  subcategory?: string;
}) => {
  const query = new URLSearchParams();
  if (tag) query.append("tag", tag);
  if (segment) query.append("segment", segment);
  if (search) query.append("search", search);
  if (category) query.append("category", category);
  if (subcategory) query.append("subcategory", subcategory);

  return `${ProductsPath}?${query.toString()}`;
};

export const ProductDetailPath = "/product/:id";
export const UserPath = "/user";
export const ProfilePath = "/user/profile";
export const UserAddressPath = "/user/address";
export const UserOrders = "/user/orders";
export const UserVouchers = "/user/vouchers";
export const RegisterPath = "/register";
export const LoginPath = "/login";
export const VerifyPath = "/verify";
export const CartPath = "/cart";
export const ShippingDetailPath = "/shipping-details";
export const PaymentMethodPath = "/payment-method";
export const PaymentDetailPath = "/payment-detail/:id";
export const NewPath = "/news";

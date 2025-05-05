export const endPoint = {
  AUTH: {
    REGISTER: "/auth/email/register",
    VERIFY: "/auth/email/verify",
    LOGIN: "/auth/email/login",
  },
  PRODUCT: {
    NEW_ARRIVAL: "/products-public/new-arrivals",
    BEST_SELLER: "/products-public/best-sellers",
    PRODUCT_BY_ID: "/products",
  },
  USER: {
    GET_USER: "/auth/me",
  },
  CART: {
    ADD_TO_CART: "/cart",
    ADD_TO_CART_IMPORT: "/cart/import",
    DELETE_CART_ITEM: "/cart/item/{itemId}",
    GET_CART_BY_USER: "/cart"
  },
};

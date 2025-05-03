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
    UPDATE_PROFILE: "/users/me",
  },
  CART: {
    ADD_TO_CART: "/cart",
    ADD_TO_CART_IMPORT: "/cart/import",
  },
  USER_ADDRESS: {
    GET_USER_ADDRESS: "/user-address/addresses",
    CREATE_USER_ADDRESS: "/user-address/address",
    DELETE_USER_ADDRESS: "/user-address/address/:id",
    SET_DEFAULT_USER_ADDRESS: "/user-address/address/:id/default",
    UPDATE_USER_ADDRESS: "/user-address/address/:id",
  },
  ORDER: {
    CREATE_ORDER: "/orders-public",
    GET_ORDER_HISTORY: "/orders-public/history",
    CANCEL_ORDER: "/orders-public/cancel/:orderId",
  },
  VOUCHER: {
    GET_VOUCHERS_BY_USER_ID: "/vouchers-public/available",
  },
};

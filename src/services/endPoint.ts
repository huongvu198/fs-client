export const endPoint = {
  AUTH: {
    REGISTER: "/auth/email/register",
    VERIFY: "/auth/email/verify",
    LOGIN: "/auth/email/login",
    REFRESH_TOKEN: "/auth/refresh",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  PRODUCT: {
    NEW_ARRIVAL: "/products-public/new-arrivals",
    BEST_SELLER: "/products-public/best-sellers",
    PRODUCT_BY_ID: "/products",
    GET_PRODUCTS_WITH_CONDITION: "/products-public/products-with-condition",
  },
  USER: {
    GET_USER: "/auth/me",
    UPDATE_PROFILE: "/users/me",
  },
  CART: {
    ADD_TO_CART: "/cart",
    ADD_TO_CART_IMPORT: "/cart/import",
    DELETE_CART_ITEM: "/cart/item/{itemId}",
    GET_CART_BY_USER: "/cart",
    ADD_VOUCHER: "/vouchers-public",
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
    ORDER_DETAIL: "/orders-public/detail/:orderId",
  },
  VOUCHER: {
    GET_VOUCHERS_BY_USER_ID: "/vouchers-public/available",
  },
  MASTER_DATA: {
    GET: `/masters-data`,
  },
  CHAT: {
    GET_CONVERSATION: "/chat/conversation",
    GET_MESSAGES: "/chat/:id/messages",
  },
  NEW: {
    GET: "/news",
  },
  SEGMENT: {
    LIST: `products-public/segments`,
  },
  CATEGORY: {
    LIST: "/products-public/categories",
  },
  REVIEWS: {
    REVIEW_BY_PID: "/products-public/review-by-productId/:id",
    CREATE: "/products-public/create-review",
  },
  EVENT: {
    GET: "/event/schedule/active",
  },
};

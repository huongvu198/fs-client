import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter";
import registerReducer from "./registerSlice";
import verifyReducer from "./verifySlice";
import productReducer from "./productSlice";
import loginReducer from "./loginSlice";
import getUserReducer from "./userSlice";
import getCartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import voucherReducer from "./voucherSlice";
import userReducer from "./userSlice";
import appReducer from "./appSlice";

const rootReducer = {
  register: registerReducer,
  counter: counterReducer,
  verifyEmail: verifyReducer,
  product: productReducer,
  login: loginReducer,
  getUser: getUserReducer,
  cart: getCartReducer,
  user: userReducer,
  order: orderReducer,
  voucher: voucherReducer,
  app: appReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["some-action/with-non-serializable-data"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type ApiDispatch = typeof store.dispatch;

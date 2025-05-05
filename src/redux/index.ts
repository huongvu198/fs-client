import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter";
import registerReducer from "./registerSlice";
import verifyReducer from "./verifySlice";
import productReducer from "./productSlice";
import loginReducer from "./loginSlice";
import getUserReducer from "./userSlice";
import getCartReducer from "./cartSlice";

const rootReducer = {
  register: registerReducer,
  counter: counterReducer,
  verifyEmail: verifyReducer,
  product: productReducer,
  login: loginReducer,
  getUser: getUserReducer,
  cart: getCartReducer
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

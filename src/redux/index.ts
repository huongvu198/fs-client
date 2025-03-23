import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type ApiDispatch = typeof store.dispatch;

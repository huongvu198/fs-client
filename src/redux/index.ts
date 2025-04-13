import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter";
import registerReducer from './register';
import verifyReducer from './verify';

const rootReducer = {
  register: registerReducer,
  counter: counterReducer,
  verifyEmail: verifyReducer
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['some-action/with-non-serializable-data'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type ApiDispatch = typeof store.dispatch;

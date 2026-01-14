import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { createWrapper } from "next-redux-wrapper";
import authReducer from "./authSlice";
import appReducer from "./appSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth: authReducer,
      app: appReducer,
    },
    middleware: (get) => get().concat(api.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/redux/features/counter/counterSlice";
import assetReducer from "@/redux/features/asset/assetSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    asset: assetReducer,
  },
});

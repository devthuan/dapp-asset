import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  id: null,
  loading: false,
  error: null,
};

export const assetSlice = createSlice({
  name: "asset",
  initialState,
  reducers: {
    initData: (state, action) => {
      state.data = action.payload;
    },
    initId: (state, action) => {
      state.id = action.payload.id;
    },
  },
});

// Action creators are generated for each case reducer function
export const { initData, initId } = assetSlice.actions;

export default assetSlice.reducer;

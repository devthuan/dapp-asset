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
    // Initialize data
    initData: (state, action) => {
      state.data = action.payload;
    },

    // Set current ID
    initId: (state, action) => {
      state.id = action.payload;
    },

    // Create a new asset
    addAsset: (state, action) => {
      state.data.push(action.payload);
    },

    // Read/Get asset by ID (handled by selector usually)

    // Update asset
    updateAsset: (state, action) => {
      const index = state.data.findIndex(
        (asset) => asset.id === action.payload.id
      );
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload };
      }
    },

    getAssetById: (state, action) => {
      const asset = state.data.find((asset) => asset.id === action.payload);
      return asset ? { ...asset } : null;
    },

    // Delete asset
    deleteAsset: (state, action) => {
      state.data = state.data.filter((asset) => asset.id !== action.payload);
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset to initial state
    resetAssets: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const {
  initData,
  initId,
  addAsset,
  getAssetById,
  updateAsset,
  deleteAsset,
  setLoading,
  setError,
  clearError,
  resetAssets,
} = assetSlice.actions;

// Selectors
export const selectAllAssets = (state) => state.asset.data;
export const selectAssetById = (state, id) =>
  state.asset.data.find((asset) => asset.id === id);
export const selectLoading = (state) => state.asset.loading;
export const selectError = (state) => state.asset.error;
export const selectCurrentId = (state) => state.asset.id;

export default assetSlice.reducer;

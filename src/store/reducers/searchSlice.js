import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  path: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchAction: (state, action) => {
      state.path = action.payload.path;
      state.value = action.payload.value;
    },
  },
});

export const { searchAction } = searchSlice.actions;

export const searchReducer = searchSlice.reducer;

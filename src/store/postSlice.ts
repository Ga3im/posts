import { createSlice } from "@reduxjs/toolkit";

export type sliceType = {
  count: number;
};

const initialState: sliceType = {
  count: 0,
};

export const postSlice = createSlice({
  name: "slices",
  initialState,
  reducers: {
    setCount: (state) => {
        state.count++;
    },
  },
});

export const { setCount } = postSlice.actions;
export const postReduser = postSlice.reducer;

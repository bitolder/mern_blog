import { createSlice } from "@reduxjs/toolkit";

const initialSlice = {
  theme: "light",
};
const themeSlice = createSlice({
  name: "theme",
  initialState: initialSlice,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});
export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

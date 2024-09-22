import { createSlice } from "@reduxjs/toolkit";
import { themes } from "##/src/utility/themes.js";


const initialState = {
  themes: [],
  currentTheme: {},
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, { payload }) {
      state.currentTheme = themes.find(
        (theme) => theme.themeId === payload.themeId,
      );
      state.themes = themes;
    },
  },
});
const selectThemes = (state) => state.theme.themes;
const selectCurrentTheme = (state) => state.theme.currentTheme;
const { setTheme } = themeSlice.actions;
export { selectThemes, selectCurrentTheme, setTheme };
export default themeSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice.js";
import loanReducer from "./slice/loanSlice.js";
import officerReducer from "./slice/officerSlice.js";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    loan: loanReducer,
    officer: officerReducer,
  },
});

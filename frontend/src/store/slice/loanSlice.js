import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const loanSlice = createSlice({
  name: "loan",
  initialState: {
    loading: false,
    error: null,
    message: null,
    myLoans: [],
    currentLoan: null,
  },
  reducers: {
    loanRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    applyLoanSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      if (action.payload.newLoan) {
        state.myLoans = [action.payload.newLoan, ...state.myLoans];
      }
    },
    applyLoanFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getMyLoansSuccess: (state, action) => {
      state.loading = false;
      state.myLoans = action.payload.loans;
    },
    getMyLoansFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.myLoans = [];
    },

    getLoanStatusSuccess: (state, action) => {
      state.loading = false;
      state.currentLoan = action.payload.loan;
    },
    getLoanStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentLoan = null;
    },

    resetLoan: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const {
  loanRequest,
  applyLoanSuccess,
  applyLoanFailure,
  getMyLoansSuccess,
  getMyLoansFailure,
  getLoanStatusSuccess,
  getLoanStatusFailure,
  resetLoan,
} = loanSlice.actions;

// RESET
export const resetLoanSlice = () => (dispatch) => {
  dispatch(resetLoan());
};

// ─────────────────────────────────────────
// APPLY LOAN  (POST)
// ─────────────────────────────────────────
export const applyLoan = (data) => async (dispatch, getState) => {
  try {
    dispatch(loanRequest());
    const token = getState().auth.token;

    const { data: response } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/loan/apply`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    dispatch(applyLoanSuccess(response));
    return { success: true, response };
  } catch (error) {
    dispatch(
      applyLoanFailure(
        error.response?.data?.message || "Loan Application Failed!"
      )
    );
    return { success: false, error };
  }
};

// ─────────────────────────────────────────
// GET MY LOANS (GET)
// ─────────────────────────────────────────
export const getMyLoans = () => async (dispatch, getState) => {
  try {
    dispatch(loanRequest());
    const token = getState().auth.token;

    const { data: response } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/loan/my-loans`,
      {
        withCredentials: true,
        Authorization: token ? `Bearer ${token}` : "",
      }
    );

    dispatch(getMyLoansSuccess(response));
  } catch (error) {
    dispatch(
      getMyLoansFailure(
        error.response?.data?.message || "Failed to fetch loans!"
      )
    );
  }
};

// ─────────────────────────────────────────
// GET LOAN STATUS (GET /loan/:id)
// ─────────────────────────────────────────
export const getLoanStatus = (loanId) => async (dispatch, getState) => {
  try {
    dispatch(loanRequest());
    const token = getState().auth.token;

    const { data: response } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/loan/${loanId}/status`,
      {
        withCredentials: true,
        Authorization: token ? `Bearer ${token}` : "",
      }
    );

    dispatch(getLoanStatusSuccess(response));
  } catch (error) {
    dispatch(
      getLoanStatusFailure(
        error.response?.data?.message || "Failed to fetch loan status!"
      )
    );
  }
};

export default loanSlice.reducer;

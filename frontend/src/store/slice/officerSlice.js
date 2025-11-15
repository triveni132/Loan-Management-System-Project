import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const officerSlice = createSlice({
  name: "officer",
  initialState: {
    loading: false,
    error: null,
    message: null,
    pendingLoans: [],
  },
  reducers: {
    officerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },

    getPendingLoansSuccess: (state, action) => {
      state.loading = false;
      state.pendingLoans = action.payload.pendingLoans;
    },
    getPendingLoansFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.pendingLoans = [];
    },

    reviewLoanSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;

      const reviewedId = action.payload.loanId;

      // Remove reviewed loan from pending list
      state.pendingLoans = state.pendingLoans.filter(
        (loan) => loan._id !== reviewedId
      );
    },
    reviewLoanFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    resetOfficer: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const {
  officerRequest,
  getPendingLoansSuccess,
  getPendingLoansFailure,
  reviewLoanSuccess,
  reviewLoanFailure,
  resetOfficer,
} = officerSlice.actions;

export const resetOfficerSlice = () => (dispatch) => dispatch(resetOfficer());

// ──────────────────────────────
// GET PENDING LOANS (GET)
// ──────────────────────────────
export const getPendingLoans = () => async (dispatch, getState) => {
  try {
    dispatch(officerRequest());
    const token = getState().auth.token;

    const { data: response } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/officer/loans/pending`,
      {
        withCredentials: true,
        Authorization: token ? `Bearer ${token}` : "",
      }
    );

    dispatch(getPendingLoansSuccess(response));
    return { success: true, response };
  } catch (error) {
    dispatch(
      getPendingLoansFailure(
        error.response?.data?.message || "Failed to fetch pending loans!"
      )
    );
  }
};

// ──────────────────────────────
// REVIEW LOAN (POST)
// ──────────────────────────────
export const reviewLoan = (loanId) => async (dispatch, getState) => {
  try {
    dispatch(officerRequest());
    const token = getState().auth.token;

    const { data: response } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/officer/loans/${loanId}/review`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    // Response *must include* updated loanId & message
    dispatch(
      reviewLoanSuccess({
        message: response.message,
        loanId: loanId,
      })
    );

    return { success: true, response };
  } catch (error) {
    dispatch(
      reviewLoanFailure(error.response?.data?.message || "Loan review failed!")
    );

    return { success: false, error };
  }
};

export default officerSlice.reducer;

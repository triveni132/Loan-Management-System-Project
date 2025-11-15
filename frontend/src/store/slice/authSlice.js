import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
    token: "",
  },
  reducers: {
    registerRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      //   state.user = action.payload.user;
      state.message = action.payload.message;
      //   state.isAuthenticated = true;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      //   state.isAuthenticated = false;
    },

    loginRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.user.salary = action.payload?.salary;
      state.user.creditScore = action.payload?.creditScore;
      state.user.branch = action.payload?.branch;
      state.token = action.payload?.token;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logoutRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    logoutSuccess: (state, action) => {
      state.loading = false;
      state.user = null;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.token = "";
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
      //   state.isAuthenticated = false;
    },
    getUserRequest: (state) => {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.user.salary = action.payload?.salary;
      state.user.creditScore = action.payload?.creditScore;
      state.user.branch = action.payload?.branch;
      state.isAuthenticated = true;
      state.token = action.payload?.token;
    },
    getUserFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.user = state.user;
      state.isAuthenticated = state.isAuthenticated;
      state.token = "";
    },
  },
});

const {
  registerRequest,
  registerSuccess,
  registerFailure,

  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  getUserRequest,
  getUserSuccess,
  getUserFailure,

  reset,
} = authSlice.actions;

export const resetAuthSlice = () => (dispatch) => {
  dispatch(reset());
};

export const register = (data) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const { data: response } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/register`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(registerSuccess(response));
    return { success: true, response };
  } catch (error) {
    dispatch(
      registerFailure(
        error.response?.data?.message || "Registration failed. Try again."
      )
    );
    return { success: false, error };
  }
};

export const login = (data) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data: response } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/login`,
      data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(loginSuccess(response));

    return { success: true, response };
  } catch (error) {
    dispatch(
      loginFailure(error.response?.data?.message || "Login failed. Try again.")
    );
    return { success: false, error };
  }
};
export const logout = () => async (dispatch, getState) => {
  try {
    dispatch(logoutRequest());
    const token = getState().auth.token;

    const { data: response } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/logout`,

      {
        withCredentials: true,
        Authorization: token ? `Bearer ${token}` : "",
      }
    );

    dispatch(logoutSuccess(response.message));
    dispatch(reset());
  } catch (error) {
    console.error("Logout error:", error);
    dispatch(
      logoutFailure(
        error.response?.data?.message || "Logout failed. Try again."
      )
    );
  }
};
export const getUser = () => async (dispatch, getState) => {
  try {
    dispatch(getUserRequest());

    const token = getState().auth.token;

    const { data: response } = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/profile`,

      {
        withCredentials: true,
        Authorization: token ? `Bearer ${token}` : "",
      }
    );

    dispatch(getUserSuccess(response));
  } catch (error) {
    dispatch(
      getUserFailure(
        error.response?.data?.message || "Fetching user failed. Try again."
      )
    );
  }
};

export default authSlice.reducer;

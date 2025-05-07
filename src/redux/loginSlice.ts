import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import loginService, { LoginRequest, LoginResponse } from "@services/login";

interface LoginState {
  data: LoginResponse | null;
  loading: boolean;
  error: string | null;
  loginSuccess: boolean;
  refreshTokenLoading: boolean;
  refreshTokenError: string | null;
}
// Initial state
const initialState: LoginState = {
  data: null,
  loading: false,
  error: null,
  loginSuccess: false,
  refreshTokenLoading: false,
  refreshTokenError: null,
};

// Create async thunk for login
export const loginUserApi = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>("login/loginUser", async (loginRequest, { rejectWithValue }) => {
  try {
    const response = await loginService.login(loginRequest);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Create async thunk for getRefreshToken
export const getRefreshTokenApi = createAsyncThunk<
  LoginResponse,
  void,
  { rejectValue: string }
>("login/getRefreshToken", async (_, { rejectWithValue }) => {
  try {
    const response = await loginService.getRefreshToken();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Create login slice
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.error = null;
      state.loginSuccess = false;
    },
    clearLoginData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserApi.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loginSuccess = false;
      })
      .addCase(
        loginUserApi.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.data = action.payload;
          state.loginSuccess = true;
          state.error = null;
        }
      )
      .addCase(loginUserApi.rejected, (state, action) => {
        state.loading = false;
        state.loginSuccess = false;
        state.error = action.payload || "Login failed";
      })
      // getRefreshTokenApi
      .addCase(getRefreshTokenApi.pending, (state) => {
        state.refreshTokenLoading = true;
        state.refreshTokenError = null;
      })
      .addCase(
        getRefreshTokenApi.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.refreshTokenLoading = false;
          state.data = action.payload;
          state.refreshTokenError = null;
        }
      )
      .addCase(getRefreshTokenApi.rejected, (state, action) => {
        state.refreshTokenLoading = false;
        state.refreshTokenError = action.payload || "Refresh token failed";
      });
  },
});

export const { resetLoginState, clearLoginData } = loginSlice.actions;
export default loginSlice.reducer;

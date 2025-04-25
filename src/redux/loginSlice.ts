import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import loginService, { LoginRequest, LoginResponse } from "@services/login";


interface LoginState {
    data: LoginResponse | null;
    loading: boolean;
    error: string | null;
    loginSuccess: boolean;
}
// Initial state
const initialState: (LoginState) = {
    data: null,
    loading: false,
    error: null,
    loginSuccess: false,
  };

  // Create async thunk for login
export const loginUserApi = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: string }>(
    "login/loginUser",
    async (loginRequest, { rejectWithValue }) => {
      try {
        const response = await loginService.login(loginRequest);
        return response;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    },
  );

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
        .addCase(loginUserApi.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.data = action.payload;
          state.loginSuccess = true;
          state.error = null;
        })
        .addCase(loginUserApi.rejected, (state, action) => {
          state.loading = false;
          state.loginSuccess = false;
          state.error = action.payload || "Login failed";
        });
    },
  });
  
  export const { resetLoginState, clearLoginData } = loginSlice.actions;
  export default loginSlice.reducer;
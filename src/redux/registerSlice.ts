import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import registerService, {
  RegisterRequest,
  RegisterResponse,
} from "../services/register";
import { showToast, ToastType } from "shared/toast";

interface RegisterState {
  data: RegisterResponse | null;
  loading: boolean;
  error: string | null;
  registerSuccess: boolean;
}

// Initial state
const initialState: RegisterState = {
  data: null,
  loading: false,
  error: null,
  registerSuccess: false,
};

// Create async thunk for registration
export const registerUserApi = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: string }
>("register/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await registerService.register(userData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Create register slice
const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.error = null;
      state.registerSuccess = false;
    },
    clearRegisterData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserApi.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(
        registerUserApi.fulfilled,
        (state, action: PayloadAction<RegisterResponse>) => {
          state.loading = false;
          state.data = action.payload;
          state.registerSuccess = true;
          state.error = null;
          showToast(ToastType.SUCCESS, "Đăng ký thành công!");
        }
      )
      .addCase(registerUserApi.rejected, (state, action) => {
        state.loading = false;
        state.registerSuccess = false;
        state.error = action.payload || "Registration failed";
        showToast(ToastType.ERROR, "Đăng ký thất bại!");
      });
  },
});

export const { resetRegisterState, clearRegisterData } = registerSlice.actions;
export default registerSlice.reducer;

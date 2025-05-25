import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import verifyService, {
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "../services/verify";
import { showToast, ToastType } from "shared/toast";

interface VerifyEmailState {
  data: VerifyEmailResponse | null;
  loading: boolean;
  error: string | null;
  verifysuccess: boolean;
}

const initialState: VerifyEmailState = {
  data: null,
  loading: false,
  error: null,
  verifysuccess: false,
};

// Async thunk for verifying email
export const verifyEmail = createAsyncThunk<
  VerifyEmailResponse,
  VerifyEmailRequest,
  { rejectValue: string }
>("verify/verifyEmail", async (verifyData, { rejectWithValue }) => {
  try {
    const response = await verifyService.verifyEmail(verifyData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const verifyEmailSlice = createSlice({
  name: "verifyEmail",
  initialState,
  reducers: {
    resetVerifyState: (state) => {
      state.loading = false;
      state.error = null;
      state.verifysuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verifysuccess = false;
      })
      .addCase(
        verifyEmail.fulfilled,
        (state, action: PayloadAction<VerifyEmailResponse>) => {
          state.loading = false;
          state.data = action.payload;
          state.verifysuccess = true;
          state.error = null;
          showToast(ToastType.ERROR, "Xác thực thành công");
        }
      )
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.verifysuccess = false;
        state.error = action.payload || "Verification failed";
        showToast(ToastType.ERROR, String(action.payload));
      });
  },
});

export const { resetVerifyState } = verifyEmailSlice.actions;
export default verifyEmailSlice.reducer;

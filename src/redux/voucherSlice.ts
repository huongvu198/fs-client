import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { voucherService } from "@services/voucher";
import { Voucher } from "interfaces/order.interface";
import { showToast, ToastType } from "shared/toast";

interface VoucherState {
  vouchers: Voucher[] | null;
  loading: boolean;
  error: string | null;
  getVouchersSuccess: boolean;
}

const initialState: VoucherState = {
  vouchers: null,
  loading: false,
  error: null,
  getVouchersSuccess: false,
};

export const getVoucherAvailable = createAsyncThunk(
  "voucher/getVoucherAvailable",
  async (_, { rejectWithValue }) => {
    try {
      const response = await voucherService.getVouchersByUserId();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch available vouchers"
      );
    }
  }
);

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    resetVoucherState: (state) => {
      state.loading = false;
      state.error = null;
      state.getVouchersSuccess = false;
    },
    clearVoucherState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVoucherAvailable.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.getVouchersSuccess = false;
      })
      .addCase(getVoucherAvailable.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
        state.getVouchersSuccess = true;
      })
      .addCase(getVoucherAvailable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.getVouchersSuccess = false;
        showToast(ToastType.ERROR, "Lấy thông tin vouchers thất bại");
      });
  },
});

export const { resetVoucherState, clearVoucherState } = voucherSlice.actions;
export default voucherSlice.reducer;

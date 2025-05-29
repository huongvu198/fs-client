import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cartService, ICartId } from "@services/cart";
import {
  CartRequest,
  ICartResponse,
  IVoucherRequest,
  IVoucherResponse,
} from "interfaces/cart.interface";
import { showToast, ToastType } from "shared/toast";

interface CartState {
  loading: boolean;
  error: string | null;
  dataCart: ICartResponse | null;
  dataVoucher: IVoucherResponse | null;
  success: boolean;
  loadingAppyVoucher: boolean;
  pointUsed: {
    amount: number;
    selected: boolean;
  };
}

const initialState: CartState = {
  dataCart: null,
  dataVoucher: null,
  loading: false,
  error: null,
  success: false,
  loadingAppyVoucher: false,
  pointUsed: {
    amount: 0,
    selected: false,
  },
};

// 1. Các API
export const addToCartApi = createAsyncThunk<
  ICartResponse,
  CartRequest,
  { rejectValue: string }
>("cart/addToCartApi", async (cartRequest, { rejectWithValue }) => {
  try {
    const response = await cartService.addToCart(cartRequest);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const addToCartImportApi = createAsyncThunk<
  ICartResponse,
  CartRequest[],
  { rejectValue: string }
>("cart/addToCartImportApi", async (cartRequest, { rejectWithValue }) => {
  try {
    const response = await cartService.addToCartImport(cartRequest);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteCartItemApi = createAsyncThunk<
  ICartResponse,
  ICartId,
  { rejectValue: string }
>("cart/deleteCartItemApi", async (cartId, { rejectWithValue }) => {
  try {
    const response = await cartService.deleteCartItems(cartId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getCartByUserApi = createAsyncThunk<
  ICartResponse,
  void,
  { rejectValue: string }
>("cart/getCartByUserApi", async (_, { rejectWithValue }) => {
  try {
    const response = await cartService.getCartByUser();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const acceptVoucherApi = createAsyncThunk<
  IVoucherResponse,
  IVoucherRequest,
  { rejectValue: string }
>("cart/acceptVoucherApi", async (voucherRequest, { rejectWithValue }) => {
  try {
    const response = await cartService.acceptVoucher(voucherRequest);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// 2. Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartData: () => initialState,
    setReduxPointUsed: (
      state,
      action: PayloadAction<{ amount: number; selected: any }>
    ) => {
      state.pointUsed = {
        amount: action.payload.amount,
        selected: action.payload.selected,
      };
    },
    clearVoucher: (state) => {
      state.dataVoucher = null;
    },
  },
  extraReducers: (builder) => {
    builder;
    builder
      // addToCartApi
      .addCase(addToCartApi.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Nếu có state riêng biệt cho apply voucher, có thể bỏ hoặc giữ tùy
      })
      .addCase(
        addToCartApi.fulfilled,
        (state, action: PayloadAction<ICartResponse>) => {
          state.loading = false;
          state.dataCart = action.payload;
          state.error = null;
          state.success = true;
        }
      )
      .addCase(addToCartApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra";
        showToast(ToastType.ERROR, String(action.payload));
      })

      // addToCartImportApi
      .addCase(addToCartImportApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addToCartImportApi.fulfilled,
        (state, action: PayloadAction<ICartResponse>) => {
          state.loading = false;
          state.dataCart = action.payload;
          state.error = null;
          state.success = true;
        }
      )
      .addCase(addToCartImportApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra";
      })

      // deleteCartItemApi
      .addCase(deleteCartItemApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCartItemApi.fulfilled,
        (state, action: PayloadAction<ICartResponse>) => {
          state.loading = false;
          state.dataCart = action.payload;
          state.error = null;
          state.success = true;
        }
      )
      .addCase(deleteCartItemApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra";
      })

      // getCartByUserApi
      .addCase(getCartByUserApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCartByUserApi.fulfilled,
        (state, action: PayloadAction<ICartResponse>) => {
          state.loading = false;
          state.dataCart = action.payload;
          state.error = null;
          state.success = true;
        }
      )
      .addCase(getCartByUserApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra";
      })

      // acceptVoucherApi
      .addCase(acceptVoucherApi.pending, (state) => {
        state.loading = true;
        state.loadingAppyVoucher = true;
        state.error = null;
      })
      .addCase(
        acceptVoucherApi.fulfilled,
        (state, action: PayloadAction<IVoucherResponse>) => {
          state.dataVoucher = action.payload;
          state.error = null;
          state.success = true;
          state.loadingAppyVoucher = false;
        }
      )
      .addCase(acceptVoucherApi.rejected, (state, action) => {
        state.loadingAppyVoucher = false;
        state.error = action.payload || "Có lỗi xảy ra";
      });
  },
});

export const { clearCartData, setReduxPointUsed, clearVoucher } =
  cartSlice.actions;
export const getPointAmount = (state: { cart: CartState }) =>
  state.cart.pointUsed.amount;
export const getPointSelect = (state: { cart: CartState }) =>
  state.cart.pointUsed.selected;

export default cartSlice.reducer;

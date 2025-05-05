import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  isAnyOf,
} from "@reduxjs/toolkit";
import { cartService, ICartId } from "@services/cart";
import { CartRequest, ICartResponse } from "interfaces/cart.interface";

interface CartState {
  loading: boolean;
  error: string | null;
  dataCart: ICartResponse | null;
  success: boolean;
}

const initialState: CartState = {
  dataCart: null,
  loading: false,
  error: null,
  success: false,
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

// 2. Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // 2.1 Pending chung
      .addMatcher(
        isAnyOf(
          addToCartApi.pending,
          addToCartImportApi.pending,
          deleteCartItemApi.pending,
          getCartByUserApi.pending
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // 2.2 Fulfilled chung
      .addMatcher(
        isAnyOf(
          addToCartApi.fulfilled,
          addToCartImportApi.fulfilled,
          deleteCartItemApi.fulfilled,
          getCartByUserApi.fulfilled
        ),
        (state, action: PayloadAction<ICartResponse>) => {
          state.loading = false;
          state.dataCart = action.payload;
          state.error = null;
          state.success = true;
        }
      )
      // 2.3 Rejected chung
      .addMatcher(
        isAnyOf(
          addToCartApi.rejected,
          addToCartImportApi.rejected,
          deleteCartItemApi.rejected,
          getCartByUserApi.rejected
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Có lỗi xảy ra";
        }
      );
  },
});

export const { clearCartData } = cartSlice.actions;
export default cartSlice.reducer;

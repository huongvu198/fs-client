import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartRequest, cartService } from "@services/cart";
import { ICartResponse } from "interfaces/cart.interface";

interface CartState {
  loading: boolean;
  error: string | null;
  dataCart: ICartResponse | null;
  addToCartSuccess: boolean;
}

const initialState: CartState = {
  dataCart: null,
  loading: false,
  error: null,
  addToCartSuccess: false,
};

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
  CartRequest,
  { rejectValue: string }
>("cart/addToCartImportApi", async (cartRequest, { rejectWithValue }) => {
  try {
    const response = await cartService.addToCartImport(cartRequest);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Create add to cart slice
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
      resetCartState: (state) => {
        state.error = null;
        state.addToCartSuccess = false;
      },
      clearCartData: () => initialState,
    },
    extraReducers: (builder) => {
      builder
        .addCase(addToCartApi.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.addToCartSuccess = false;
        })
        .addCase(addToCartApi.fulfilled, (state, action: PayloadAction<ICartResponse>) => {
          state.loading = false;
          state.dataCart = action.payload;
          state.addToCartSuccess = true;
          state.error = null;
        })
        .addCase(addToCartApi.rejected, (state, action) => {
          state.loading = false;
          state.addToCartSuccess = false;
          state.error = action.payload || "Add To Cart failed";
        })
        .addCase(addToCartImportApi.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.addToCartSuccess = false;
        })
        .addCase(addToCartImportApi.fulfilled, (state, action: PayloadAction<ICartResponse>) => {
          state.loading = false;
          state.dataCart = action.payload;
          state.addToCartSuccess = true;
          state.error = null;
        })
        .addCase(addToCartImportApi.rejected, (state, action) => {
          state.loading = false;
          state.addToCartSuccess = false;
          state.error = action.payload || "Add To Cart failed";
        });
    },
  });
  
  export const { resetCartState, clearCartData } = cartSlice.actions;
  export default cartSlice.reducer;
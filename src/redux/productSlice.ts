import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Pagination } from "interfaces/app.interface";
import { IProductResponse } from "interfaces/product.interface";
import { productsService } from "services/product";
import { parsePaginationHeaders } from "shared/common";
import { showToast, ToastType } from "shared/toast";

interface ProductState {
  isLoading: boolean;
  error: string | null;
  products: IProductResponse[];
  newArrivals: IProductResponse[];
  bestSellers: IProductResponse[];
  pagination: Pagination;
  product: IProductResponse | null;
}

const initialState: ProductState = {
  isLoading: false,
  error: null,
  products: [],
  newArrivals: [],
  bestSellers: [],
  pagination: {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    perPage: 10,
  },
  product: null,
};

export const getNewArrivals = createAsyncThunk(
  "product/getNewArrivals",
  async (params?: { page?: number; perPage?: number }) => {
    const response = await productsService.getNewArrivals(params || {});
    return response;
  }
);
export const getBestSellers = createAsyncThunk(
  "product/getBestSellers",
  async (params?: { page?: number; perPage?: number }) => {
    const response = await productsService.getBestSellers(params || {});
    return response;
  }
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id: string) => {
    const response = await productsService.getProductById(id);
    return response;
  }
);

export const getProductWithCondition = createAsyncThunk(
  "product/getProductWithCondition",
  async (params: {
    page?: number;
    perPage?: number;
    tag?: string;
    search?: string;
    color?: string[] | string;
    size?: string[] | string;
  }) => {
    const response = await productsService.getProductsWithCondition(params);
    return response;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNewArrivals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNewArrivals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newArrivals = action.payload.items;
        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(getNewArrivals.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Lấy danh sách sản phẩm mới thất bại";
        showToast(ToastType.ERROR, "Lấy danh sách sản phẩm mới thất bại");
      })
      .addCase(getBestSellers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBestSellers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bestSellers = action.payload.items;
        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(getBestSellers.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Lấy danh sách sản phẩm bán chạy thất bại";
        showToast(ToastType.ERROR, "Lấy danh sách sản phẩm bán chạy thất bại");
      })
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Lấy chi tiết sản phẩm thất bại.";
        showToast(ToastType.ERROR, "Lấy chi tiết sản phẩm thất bại.");
      })
      .addCase(getProductWithCondition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductWithCondition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.items;
        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(getProductWithCondition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Lấy danh sách sản phẩm thất bại";
        showToast(ToastType.ERROR, "Lấy danh sách sản phẩm thất bại");
      });
  },
});

export const newArrivals = (state: { product: ProductState }) =>
  state.product.newArrivals;
export const bestSellers = (state: { product: ProductState }) =>
  state.product.bestSellers;
export const productById = (state: { product: ProductState }) =>
  state.product.product;

export const {} = productSlice.actions;

export default productSlice.reducer;

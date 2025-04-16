import { createSlice } from "@reduxjs/toolkit";
import { Pagination } from "interfaces/app.interface";
import { IProductResponse } from "interfaces/product.interface";

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

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
});

export default productSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IOrderReq, Order, QR } from "../interfaces/order.interface";
import { orderService } from "@services/order";
import { Pagination } from "../interfaces/app.interface";
import { parsePaginationHeaders } from "shared/common";

interface OrderState {
  orderHistory: Order[] | null;
  loading: boolean;
  error: string | null;
  getOrderHistorySuccess: boolean;
  cancelOrderSuccess: boolean;
  createOrderSuccess: boolean;
  pagination: Pagination;
  orderQr:  QR | null ;
}

const initialState: OrderState = {
  orderHistory: null,
  loading: false,
  error: null,
  getOrderHistorySuccess: false,
  createOrderSuccess: false,
  cancelOrderSuccess: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0,
  },
  orderQr : null
};

// Async thunk to fetch order history with pagination
export const getOrderHistory = createAsyncThunk(
  "order/getOrderHistory",
  async (params: { page?: number; perPage?: number }, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderHistory(params);
      return response; // Assuming response contains { items, headers }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch order history");
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(orderId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to cancel order");
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderReq: IOrderReq, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderReq);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create order"); 
    }
  }
)

// Slice for order state management
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.error = null;
      state.loading = false;
      state.getOrderHistorySuccess = false;
      state.cancelOrderSuccess = false;
    },
    clearOrderState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.getOrderHistorySuccess = false;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload.items;
        state.getOrderHistorySuccess = true;
        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(getOrderHistory.rejected, (state) => {
        state.loading = false;
        state.error = "Lấy danh sách đơn hàng thất bại";
        state.getOrderHistorySuccess = false;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.cancelOrderSuccess = false;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload.items;
        state.cancelOrderSuccess = true;
        state.pagination = parsePaginationHeaders(action.payload.headers);
      })
      .addCase(cancelOrder.rejected, (state) => {
        state.loading = false;
        state.error = "Huỷ đơn hàng thất bại";
        state.cancelOrderSuccess = false;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.cancelOrderSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderQr = action.payload.qr;
        state.createOrderSuccess = true;
      })
      .addCase(createOrder.rejected, (state) => {
        state.loading = false;
        state.error = "Mã QR đang xảy ra lỗi , vui lòng thử lại!";
        state.createOrderSuccess = false;
      });
  },
});

export const { resetOrderState, clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;

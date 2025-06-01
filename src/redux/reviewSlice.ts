import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateReviewDto, Review } from "../interfaces/review.interface";
import { Pagination } from "../interfaces/app.interface";
import { authAxios } from "@config/axiosConfig";
import { endPoint } from "@services/endPoint";
import { parsePaginationHeaders } from "../shared/common";
import { showToast, ToastType } from "shared/toast";

interface ReviewState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  reviews: Review[];
  pagination: Pagination;
}

const initialState: ReviewState = {
  isLoading: false,
  error: null,
  success: null,
  reviews: [],
  pagination: {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    perPage: 10,
  },
};

export const getReviewByProductId = createAsyncThunk(
  "review/getReview",
  async (
    params: {
      id: string;
      page?: number;
      perPage?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAxios.get(
        endPoint.REVIEWS.REVIEW_BY_PID.replace(":id", params.id),
        {
          params: {
            page: params.page || 1,
            perPage: params.perPage || 10,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createReview = createAsyncThunk(
  "review/create",
  async (payload: CreateReviewDto, { rejectWithValue }) => {
    try {
      const response = await authAxios.post(endPoint.REVIEWS.CREATE, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setUpdateReview(state, action) {
      const updatedItem = action.payload;

      const index = state.reviews.findIndex(
        (item) => item.id === updatedItem.id
      );
      if (index !== -1) {
        state.reviews[index] = updatedItem;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviewByProductId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getReviewByProductId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.items;
        state.pagination = parsePaginationHeaders(action.payload.headers);
        state.success = "Fetched reviews successfully";
      })
      .addCase(getReviewByProductId.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
        showToast(ToastType.SUCCESS, "Đánh giá sản phẩm thành công");
      })
      .addCase(createReview.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const getReviewsRedux = (state: { review: ReviewState }) =>
  state.review.reviews;
export const getReviewPaging = (state: { review: ReviewState }) =>
  state.review.pagination;

export const { setUpdateReview } = reviewSlice.actions;

export default reviewSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISegment, Segment } from "../interfaces/segment.interface";
import { authAxios } from "../config/axiosConfig";
import { showToast, ToastType } from "../shared/toast";
import { Pagination } from "../interfaces/app.interface";
import { endPoint } from "@services/endPoint";

interface SegmentState {
  segment: ISegment[] | Segment[];
  segmentPaging: ISegment[] | Segment[];
  loading: boolean;
  loadingAction: boolean;
  pagination: Pagination;
}

const initialState: SegmentState = {
  segment: [],
  loading: false,
  loadingAction: false,
  segmentPaging: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalItems: 0,
  },
};

export const getSegments = createAsyncThunk(
  "segment/get-segments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAxios.get<ISegment[]>(endPoint.SEGMENT.LIST);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const segmentSlice = createSlice({
  name: "segment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getSegments.fulfilled,
        (state, action: PayloadAction<ISegment[]>) => {
          state.segment = action.payload;
          state.loading = false;
        }
      )
      .addCase(getSegments.rejected, (state) => {
        showToast(ToastType.ERROR, "Fetch segment faild");
        state.loading = false;
      });
  },
});

export const getListSegment = (state: { segment: SegmentState }) =>
  state.segment.segment;

export const {} = segmentSlice.actions;

export default segmentSlice.reducer;

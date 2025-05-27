import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { masterDataService } from "@services/masterdata";
import { newService } from "@services/new";
import { New } from "interfaces/new.interface";
import { CategoryItem } from "interfaces/segment.interface";

interface AppState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  masterData: any;
  defaultPerPage: number;
  newData: New | null;
  isOpenChat: boolean;
  categories: CategoryItem[];
}

const initialState: AppState = {
  isLoading: false,
  error: null,
  success: null,
  masterData: null,
  defaultPerPage: 10,
  newData: null,
  isOpenChat: false,
  categories: [],
};

// Thunk để fetch master data từ API
export const getMasterData = createAsyncThunk("app/getMasterData", async () => {
  const response = await masterDataService.getMasterData();
  return response;
});

export const getNew = createAsyncThunk("app/new", async () => {
  const response = await newService.getNewData();
  return response;
});

export const getCategories = createAsyncThunk("app/categories", async () => {
  const response = await masterDataService.getCategories();
  return response;
});

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsOpenChat: (state, action) => {
      state.isOpenChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMasterData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMasterData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.masterData = action.payload.data;
        state.defaultPerPage = action.payload.data.DefaultPerPage || 10;
      })
      .addCase(getMasterData.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getNew.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNew.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newData = action.payload;
      })
      .addCase(getNew.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setIsOpenChat } = appSlice.actions;

export const getColors = (state: { app: AppState }) =>
  state.app.masterData?.colors;

export const getIsOpenChat = (state: { app: AppState }) => state.app.isOpenChat;
export const getCategoriesRedux = (state: { app: AppState }) =>
  state.app.categories;
export default appSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { masterDataService } from "@services/masterdata";

interface AppState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  masterData: any;
  defaultPerPage: number;
}

const initialState: AppState = {
  isLoading: false,
  error: null,
  success: null,
  masterData: null,
  defaultPerPage: 10,
};

// Thunk để fetch master data từ API
export const getMasterData = createAsyncThunk("app/getMasterData", async () => {
  const response = await masterDataService.getMasterData();
  return response;
});

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMasterData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMasterData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.masterData = action.payload.data;
        state.defaultPerPage = action.payload.data.DefaultPerPage || 10; // Set defaultPerPage from API response
      })
      .addCase(getMasterData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {} = appSlice.actions;

export default appSlice.reducer;

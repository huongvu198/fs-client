import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import userService, { UserResponse } from "@services/user";


interface UserState {
    data: UserResponse | null;
    loading: boolean;
    error: string | null;
    getUserSuccess: boolean;
}

// Initial state
const initialState: UserState = {
    data: null,
    loading: false,
    error: null,
    getUserSuccess: false,
  };

  // Create async thunk for get user
  export const getUserApi = createAsyncThunk<UserResponse, void, { rejectValue: string }>(
    "user/getUser",
    async (_, { rejectWithValue }) => {
      try {
        const response = await userService.getUser();
        return response;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }
  );

  // Create user slice
  const userSlice = createSlice({
    name: "getUser",
    initialState,
    reducers: {
      resetUserState: (state) => {
        state.error = null;
        state.getUserSuccess = false;
      },
      clearUserData: () => initialState,
    },
    extraReducers: (builder) => {
      builder
        .addCase(getUserApi.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.getUserSuccess = false;
        })
        .addCase(getUserApi.fulfilled, (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.data = action.payload;
          state.getUserSuccess = true;
          state.error = null;
        })
        .addCase(getUserApi.rejected, (state, action) => {
          state.loading = false;
          state.getUserSuccess = false;
          state.error = action.payload || "Get user failed";
        });
    },
  });
  
  export const { resetUserState, clearUserData } = userSlice.actions;
  export default userSlice.reducer;
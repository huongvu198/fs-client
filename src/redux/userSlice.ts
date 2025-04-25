import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUpdateProfile, UserResponse } from "../interfaces/user.interface";
import { userService } from "@services/user";

interface UserState {
  data: UserResponse | null;
  loading: boolean;
  error: string | null;
  getUserSuccess: boolean;
  updateUserSuccess: boolean;
}

// Initial state
const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
  getUserSuccess: false,
  updateUserSuccess: false,
};

// Create async thunk for get user
export const getUserApi = createAsyncThunk<
  UserResponse,
  void,
  { rejectValue: string }
>("user/getUser", async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getUser();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateProfileApi = createAsyncThunk<
  UserResponse,
  IUpdateProfile,
  { rejectValue: string }
>("user/updateProfile", async (updateProfileDto, { rejectWithValue }) => {
  try {
    const response = await userService.updateProfile(updateProfileDto);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Create user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.error = null;
      state.getUserSuccess = false;
      state.updateUserSuccess = false;
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
      .addCase(
        getUserApi.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.data = action.payload;
          state.getUserSuccess = true;
          state.error = null;
        }
      )
      .addCase(getUserApi.rejected, (state, action) => {
        state.loading = false;
        state.getUserSuccess = false;
        state.error = action.payload || "Get user failed";
      })
      .addCase(updateProfileApi.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateUserSuccess = false;
      })
      .addCase(
        updateProfileApi.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.data = action.payload;
          state.updateUserSuccess = true;
          state.error = null;
        }
      )
      .addCase(updateProfileApi.rejected, (state, action) => {
        state.loading = false;
        state.updateUserSuccess = false;
        state.error = action.payload || "Cập nhật thông tin thất bại";
      });
  },
});

export const { resetUserState, clearUserData } = userSlice.actions;
export default userSlice.reducer;

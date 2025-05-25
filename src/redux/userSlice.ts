import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChangePasswordPayload,
  CreateAddressPayload,
  IUpdateProfile,
  UpdateAddressPayload,
  UserAddress,
  UserResponse,
} from "../interfaces/user.interface";
import { userService } from "@services/user";
import { showToast, ToastType } from "shared/toast";

interface UserState {
  data: UserResponse | null;
  loading: boolean;
  loadingAction: boolean;
  error: string | null;
  getUserSuccess: boolean;
  updateUserSuccess: boolean;
  getUserAddressSuccess: boolean;
  setAddressDefaultSuccess: boolean;
  updateAddressSuccess: boolean;
  createAddressSuccess: boolean;
  deleteAddressSuccess: boolean;
  userAddress: UserAddress | null;
  changePasswordSuccess: boolean;
  loadingActionChangePassword: boolean;
}

// Initial state
const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
  getUserSuccess: false,
  updateUserSuccess: false,
  getUserAddressSuccess: false,
  setAddressDefaultSuccess: false,
  updateAddressSuccess: false,
  createAddressSuccess: false,
  deleteAddressSuccess: false,
  userAddress: null,
  loadingAction: false,
  changePasswordSuccess: false,
  loadingActionChangePassword: false,
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

export const getUserAddress = createAsyncThunk<
  UserAddress,
  void,
  { rejectValue: string }
>("user/getUserAddress", async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getUserAddress();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const setDefaultAddress = createAsyncThunk<
  UserAddress,
  string, // Accepts an address ID as a parameter
  { rejectValue: string }
>("user/setDefaultAddress", async (id: string, { rejectWithValue }) => {
  try {
    const response = await userService.setDefaultAddress(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateAddress = createAsyncThunk<
  UserAddress, // Kết quả trả về nếu thành công
  { id: string; data: UpdateAddressPayload }, // Tham số truyền vào thunk
  { rejectValue: string } // Kiểu giá trị trả về nếu thất bại
>("user/updateAddress", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await userService.updateAddress(id, data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createAddress = createAsyncThunk<
  UserAddress, // Kết quả trả về nếu thành công
  CreateAddressPayload, // Dữ liệu đầu vào (payload)
  { rejectValue: string } // Giá trị nếu bị lỗi
>("user/createAddress", async (data, { rejectWithValue }) => {
  try {
    const response = await userService.createAddress(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteAddress = createAsyncThunk<
  UserAddress, // Kết quả trả về nếu thành công
  string, // Dữ liệu đầu vào (payload)
  { rejectValue: string } // Giá trị nếu bị lỗi
>("user/deleteAddress", async (id: string, { rejectWithValue }) => {
  try {
    const response = await userService.deleteAddress(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const changePassword = createAsyncThunk<
  void,
  ChangePasswordPayload,
  { rejectValue: string }
>("user/changePassword", async (payload, { rejectWithValue }) => {
  try {
    await userService.changePassword(payload);
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
      state.getUserAddressSuccess = false;
      state.setAddressDefaultSuccess = false;
      state.updateAddressSuccess = false;
      state.createAddressSuccess = false;
      state.deleteAddressSuccess = false;
      state.loading = false;
      state.loadingAction = false;
      state.loadingActionChangePassword = false;
      state.changePasswordSuccess = false;
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
        state.loadingAction = true;
        state.error = null;
        state.updateUserSuccess = false;
      })
      .addCase(
        updateProfileApi.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loadingAction = false;
          state.data = action.payload;
          state.updateUserSuccess = true;
          state.error = null;
          showToast(ToastType.SUCCESS, "Cập nhật thông tin thành công");
        }
      )
      .addCase(updateProfileApi.rejected, (state, action) => {
        state.loadingAction = false;
        state.updateUserSuccess = false;
        state.error = action.payload || "Cập nhật thông tin thất bại";
        showToast(ToastType.ERROR, "Cập nhật thông tin thất bại");
      })
      .addCase(getUserAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.getUserAddressSuccess = false;
      })
      .addCase(
        getUserAddress.fulfilled,
        (state, action: PayloadAction<UserAddress>) => {
          state.loading = false;
          state.userAddress = action.payload;
          state.getUserAddressSuccess = true;
          state.error = null;
        }
      )
      .addCase(getUserAddress.rejected, (state) => {
        state.loading = false;
        state.getUserAddressSuccess = false;
        state.error = "Lấy thông tin địa chỉ thất bại";
        showToast(ToastType.ERROR, "Lấy thông tin địa chỉ thất bại");
      })
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.setAddressDefaultSuccess = false;
      })
      .addCase(
        setDefaultAddress.fulfilled,
        (state, action: PayloadAction<UserAddress>) => {
          state.loadingAction = false;
          state.userAddress = action.payload;
          state.error = null;
          state.setAddressDefaultSuccess = true;
          showToast(ToastType.SUCCESS, "Thiết lập địa chỉ mặc định thành công");
        }
      )
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload || "Thiết lập địa chỉ mặc định thất bại";
        state.setAddressDefaultSuccess = false;
        showToast(ToastType.ERROR, "Thiết lập địa chỉ mặc định thất bại");
      })
      .addCase(updateAddress.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
        state.updateAddressSuccess = false;
      })
      .addCase(
        updateAddress.fulfilled,
        (state, action: PayloadAction<UserAddress>) => {
          state.loadingAction = false;
          state.userAddress = action.payload;
          state.error = null;
          state.updateAddressSuccess = true;
          showToast(ToastType.SUCCESS, "Cập nhật địa chỉ thành công");
        }
      )
      .addCase(updateAddress.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload || "Cập nhật địa chỉ thất bại";
        state.updateAddressSuccess = false;
        showToast(ToastType.ERROR, "Cập nhật địa chỉ thất bại");
      })
      .addCase(createAddress.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
        state.createAddressSuccess = false;
      })
      .addCase(
        createAddress.fulfilled,
        (state, action: PayloadAction<UserAddress>) => {
          state.loadingAction = false;
          state.userAddress = action.payload;
          state.error = null;
          state.createAddressSuccess = true;
          showToast(ToastType.SUCCESS, "Thêm địa chỉ thành công");
        }
      )
      .addCase(createAddress.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload || "Thêm địa chỉ thất bại";
        state.createAddressSuccess = false;
        showToast(ToastType.ERROR, "Thêm địa chỉ thất bại");
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
        state.deleteAddressSuccess = false;
      })
      .addCase(
        deleteAddress.fulfilled,
        (state, action: PayloadAction<UserAddress>) => {
          state.loadingAction = false;
          state.userAddress = action.payload;
          state.error = null;
          state.deleteAddressSuccess = true;
          showToast(ToastType.SUCCESS, "Xoá địa chỉ thành công");
        }
      )
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload || "Xóa địa chỉ thất bại";
        state.deleteAddressSuccess = false;
        showToast(ToastType.ERROR, "Xóa địa chỉ thất bại");
      })
      .addCase(changePassword.pending, (state) => {
        state.loadingActionChangePassword = true;
        state.error = null;
        state.changePasswordSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loadingActionChangePassword = false;
        state.error = null;
        state.changePasswordSuccess = true;
        showToast(ToastType.SUCCESS, "Thay đổi mật khẩu thành công");
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loadingActionChangePassword = false;
        state.error = action.payload || "Thay đổi mật khẩu thất bại";
        state.changePasswordSuccess = false;
        showToast(ToastType.ERROR, "Thay đổi mật khẩu thất bại");
      });
  },
});

export const { resetUserState, clearUserData } = userSlice.actions;
export const getUserPoint = (state: { user: UserState }) =>
  state.user.data?.point || 0;
export default userSlice.reducer;

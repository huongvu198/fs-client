import { authAxios } from "@config/axiosConfig";
import { endPoint } from "./endPoint";
import {
  ChangePasswordPayload,
  IUpdateProfile,
  UpdateAddressPayload,
  UserResponse,
} from "interfaces/user.interface";

export const userService = {
  getUser: async (): Promise<UserResponse> => {
    try {
      const response = await authAxios.get<UserResponse>(
        endPoint.USER.GET_USER
      );

      if (response.data.message && response.data.statusCode) {
        throw new Error(response.data.message || "Get User fail!!");
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during get user");
    }
  },
  updateProfile: async (updateProfileDto: IUpdateProfile) => {
    try {
      const response = await authAxios.patch(
        endPoint.USER.UPDATE_PROFILE,
        updateProfileDto
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        error.message || "An error occurred during update profile"
      );
    }
  },

  getUserAddress: async () => {
    try {
      const response = await authAxios.get(
        endPoint.USER_ADDRESS.GET_USER_ADDRESS
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        error.message || "An error occurred during get user address"
      );
    }
  },
  setDefaultAddress: async (addressId: string) => {
    try {
      const response = await authAxios.patch(
        endPoint.USER_ADDRESS.SET_DEFAULT_USER_ADDRESS.replace(":id", addressId)
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        error.message || "An error occurred during set default address"
      );
    }
  },

  updateAddress: async (
    addressId: string,
    addressData: UpdateAddressPayload
  ) => {
    try {
      const response = await authAxios.patch(
        endPoint.USER_ADDRESS.UPDATE_USER_ADDRESS.replace(":id", addressId),
        addressData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        error.message || "An error occurred during update address"
      );
    }
  },

  createAddress: async (addressData: UpdateAddressPayload) => {
    try {
      const response = await authAxios.post(
        endPoint.USER_ADDRESS.CREATE_USER_ADDRESS,
        addressData
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        error.message || "An error occurred during create address"
      );
    }
  },

  deleteAddress: async (addressId: string) => {
    try {
      const response = await authAxios.delete(
        endPoint.USER_ADDRESS.DELETE_USER_ADDRESS.replace(":id", addressId)
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        error.message || "An error occurred during delete address"
      );
    }
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    try {
      const response = await authAxios.post(
        endPoint.AUTH.CHANGE_PASSWORD,
        payload
      );
      return response;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        error.message || "An error occurred during change password"
      );
    }
  },
};

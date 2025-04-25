import { authAxios } from "@config/axiosConfig";
import { endPoint } from "./endPoint";
import { IUpdateProfile, UserResponse } from "interfaces/user.interface";

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
};

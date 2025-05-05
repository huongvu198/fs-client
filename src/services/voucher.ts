import { authAxios } from "@config/axiosConfig";
import { endPoint } from "./endPoint";

export const voucherService = {
  getVouchersByUserId: async () => {
    try {
      const response = await authAxios.get(
        endPoint.VOUCHER.GET_VOUCHERS_BY_USER_ID
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during get vouchers");
    }
  },
};

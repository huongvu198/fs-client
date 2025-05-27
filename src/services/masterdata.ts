import { unauthAxios } from "@config/axiosConfig";
import { endPoint } from "./endPoint";

export const masterDataService = {
  getMasterData: async () => {
    try {
      const response = await unauthAxios.get(endPoint.MASTER_DATA.GET);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        error.message || "An error occurred during get master data"
      );
    }
  },
  getCategories: async () => {
    try {
      const response = await unauthAxios.get(endPoint.CATEGORY.LIST);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        error.message || "An error occurred during get categories"
      );
    }
  },
};

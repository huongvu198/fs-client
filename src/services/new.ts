import { unauthAxios } from "@config/axiosConfig";
import { endPoint } from "./endPoint";

export const newService = {
  getNewData: async () => {
    try {
      const response = await unauthAxios.get(endPoint.NEW.GET);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during get new data");
    }
  },
};

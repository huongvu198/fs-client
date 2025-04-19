import { unauthAxios } from "@config/axiosConfig";
import { PaginatedResponse } from "interfaces/app.interface";
import { IProductResponse } from "interfaces/product.interface";
import { endPoint } from "./endPoint";

export const productsService = {
  getNewArrivals: async (params: { page?: number; perPage?: number }) => {
    try {
      const response = await unauthAxios.get<
        PaginatedResponse<IProductResponse>
      >(endPoint.PRODUCT.NEW_ARRIVAL, {
        params,
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during get arrivals");
    }
  },
  getBestSellers: async (params: { page?: number; perPage?: number }) => {
    try {
      const response = await unauthAxios.get<
        PaginatedResponse<IProductResponse>
      >(endPoint.PRODUCT.BEST_SELLER, {
        params,
      });
      if (response.data.headers) {
        return response.data;
      }
      throw new Error("Invalid response format");
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during get arrivals");
    }
  },
  getProductById: async (id: string) => {
    try {
      const response = await unauthAxios.get<IProductResponse>(
        endPoint.PRODUCT.PRODUCT_BY_ID + `/${id}`
      );
      if (response.data) {
        return response.data;
      }
      throw new Error("Invalid response format");
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during get arrivals");
    }
  },
};

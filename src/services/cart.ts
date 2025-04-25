import { authAxios } from "@config/axiosConfig";
import { ICartResponse } from "interfaces/cart.interface";
import { endPoint } from "./endPoint";

export interface CartRequest {
  productId: string;
  variantId: string;
  sizeId: string;
  quantity: number;
}

export const cartService = {
  addToCart: async (cartRequest: CartRequest): Promise<ICartResponse> => {
    try {
      const response = await authAxios.post<ICartResponse>(
        endPoint.CART.ADD_TO_CART,
        cartRequest
      );
      if (response.data.statusCode && response.data.statusCode >= 400) {
        throw new Error(response.data.message || "Add To Cart failed");
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during registration");
    }
  },
  addToCartImport: async (cartRequest: CartRequest): Promise<ICartResponse> => {
    try {
      const response = await authAxios.post<ICartResponse>(
        endPoint.CART.ADD_TO_CART_IMPORT,
        cartRequest
      );
      if (response.data.statusCode && response.data.statusCode >= 400) {
        throw new Error(response.data.message || "Add To Cart failed");
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during registration");
    }
  }
};

import { authAxios } from "@config/axiosConfig";
import { CartRequest, ICartResponse } from "interfaces/cart.interface";
import { endPoint } from "./endPoint";

export interface ICartId {
  id: string;
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
  addToCartImport: async (cartRequest: CartRequest[]): Promise<ICartResponse> => {
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
  },
  deleteCartItems: async (cartId: ICartId): Promise<ICartResponse> => {
    try {
      const response = await authAxios.delete<ICartResponse>(
        endPoint.CART.DELETE_CART_ITEM.replace("{itemId}", cartId.id)
      );
      if (response.data.statusCode && response.data.statusCode >= 400) {
        throw new Error(response.data.message || "Delete Cart Item failed");
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during deleting cart item");
    }
  },
  getCartByUser: async (): Promise<ICartResponse> => {
    try {
      const response = await authAxios.get<ICartResponse>(
        endPoint.CART.GET_CART_BY_USER
      );
      if (response.data.statusCode && response.data.statusCode >= 400) {
        throw new Error(response.data.message || "Get Cart failed");
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during getting cart");
    }
  }
};

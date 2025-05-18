import { authAxios } from "@config/axiosConfig";
import { PaginatedResponse } from "interfaces/app.interface";
import { IOrderReq, IOrderResponse, Order } from "interfaces/order.interface";
import { endPoint } from "./endPoint";

export const orderService = {
  getOrderHistory: async (params: { page?: number; perPage?: number }) => {
    try {
      const response = await authAxios.get<PaginatedResponse<Order>>(
        endPoint.ORDER.GET_ORDER_HISTORY,
        {
          params,
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(
        error.message || "An error occurred during get order history"
      );
    }
  },
  cancelOrder: async (orderId: string) => {
    try {
      const response = await authAxios.patch(
        endPoint.ORDER.CANCEL_ORDER.replace(":orderId", orderId)
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during cancel order");
    }
  },
  createOrder: async (params: IOrderReq): Promise<IOrderResponse> => {
    try {
      const response = await authAxios.post<IOrderResponse>(
        endPoint.ORDER.CREATE_ORDER,
        params
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during create order");
    }
  },
  orderDetail: async (orderId: string): Promise<IOrderResponse> => {
    try {
      const response = await authAxios.get<IOrderResponse>(
        endPoint.ORDER.ORDER_DETAIL.replace(":orderId", orderId)
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during create order");
    }
  },
};

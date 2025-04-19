import { unauthAxios } from "@config/axiosConfig";
import { endPoint } from "./endPoint";

export interface VerifyEmailRequest {
  id: string;
  code: string;
  type: string;
}

export interface VerifyEmailResponse {
  errorCode?: string;
  message?: string;
  statusCode?: number;
}

export const verifyService = {
  verifyEmail: async (
    userData: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    try {
      const response = await unauthAxios.post<VerifyEmailResponse>(
        endPoint.AUTH.VERIFY,
        userData
      );

      if (response.data.statusCode && response.data.statusCode >= 400) {
        throw new Error(response.data.message || "Verification failed");
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during verification");
    }
  },
};

export default verifyService;

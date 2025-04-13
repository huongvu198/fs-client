import axios from "axios";
import { API_BASE_URL } from "@constants/const";

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
  verifyEmail: async (userData: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    try {
      const response = await axios.post<VerifyEmailResponse>(
        `${API_BASE_URL}/auth/email/verify`,
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

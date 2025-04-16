import { API_BASE_URL } from "@constants/const";
import axios from "axios";

// Define types for API requests and responses
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  errorCode?: string;
  message?: string;
  statusCode?: number;
}

// Register API service
export const registerService = {
  /**
   * Register a new user
   * @param userData User registration data
   * @returns Promise with user data and token
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/email/register`, userData);

      if (response.data.statusCode && response.data.statusCode >= 400) {
        throw new Error(response.data.message || "Registration failed");
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "An error occurred during registration");
    }
  },
};

export default registerService;

import { refreshAuthAxios, unauthAxios } from "@config/axiosConfig";
import { endPoint } from "./endPoint";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    refreshToken?: string;
    token?: string;
    tokenExpires?: number;
    refreshExpires?:number;
    errorCode?: string;
    message?: string;
    statusCode?: number;
}


export const loginService = {
   
    login: async (loginRequest: LoginRequest) : Promise<LoginResponse> => {
        try {
            const response = await unauthAxios.post<LoginResponse>(
                endPoint.AUTH.LOGIN,
                loginRequest
            );

            if (response.data.statusCode && response.data.statusCode) {
                throw new Error(response.data.message || "Login fail!!")
            }

            return response.data
        } catch (error:any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
              }
              throw new Error(error.message || "An error occurred during login");
        }
    },
    getRefreshToken: async (): Promise<LoginResponse> => {
        try {
            const response = await refreshAuthAxios.post<LoginResponse>(
                endPoint.AUTH.REFRESH_TOKEN,
                {}
            );
    
            if (!response.data || !response.data.refreshToken) {
                throw new Error("No refresh token received from server");
            }
    
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(error.message || "An error occurred while refreshing token");
        }
    }
}

export default loginService;
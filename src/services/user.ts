import { authAxios } from "@config/axiosConfig";
import { endPoint } from "./endPoint";
import { IAddresses, IRole, IStatus } from "interfaces/user.interface";


export interface UserResponse {
    id: number;
    email:string;
    firstName:string;
    lastName:string;
    fullName:string;
    provider:string;
    socialId:string | null;
    createdAt?:string;
    updatedAt?:string;
    role: IRole;
    status: IStatus;
    addresses?:IAddresses[];
    message?: string;
    statusCode?: number | undefined;
}

export const userService = {
    
    getUser: async () : Promise<UserResponse> => {
        try {
            const response = await authAxios.get<UserResponse>(
                endPoint.USER.GET_USER,
            );

            if (response.data.message && response.data.statusCode) {
                throw new Error(response.data.message || "Get User fail!!")
            }

            return response.data
        } catch (error:any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
              }
              throw new Error(error.message || "An error occurred during get user");
        }
    }
}

export default userService;
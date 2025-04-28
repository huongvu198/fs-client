export interface IRole {
  id: number;
  name: string;
}

export interface IStatus {
  id: number;
  name: string;
}

export interface IAddresses {
  id: string;
  street: string;
  city: string;
  ward: string;
  country: string;
  isDefault: boolean;
}

export interface IUpdateProfile {
  fullName: string;
}

export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  provider: string;
  socialId: string | null;
  createdAt?: string;
  updatedAt?: string;
  role: IRole;
  status: IStatus;
  addresses?: IAddresses[];
  message?: string;
  statusCode?: number | undefined;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
}

export interface UserAddress {
  user: User;
  addresses: Address[];
}

export interface UpdateAddressPayload {
  fullName?: string;
  phone?: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  country?: string;
  isDefault?: boolean;
}

export interface CreateAddressPayload {
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  isDefault?: boolean;
}

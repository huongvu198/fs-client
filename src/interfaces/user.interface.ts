export interface IRole {
    id:number;
    name:string;
}

export interface IStatus {
    id: number;
    name: string
}

export interface IAddresses {
    id: string;
    street:string;
    city: string;
    ward: string;
    country:string;
    isDefault: boolean;
}

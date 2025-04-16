export interface IProduct {
  categoryId: string;
  subCategoryId: string;
  segmentId: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  discount: number;
  variants: IVariant[];
}

export interface IVariant {
  color: string;
  image: string;
  isActive: boolean;
  sizes: ISize[];
}

export interface ISize {
  size: string;
  isActive: boolean;
  quantity: number;
  inventory?: number;
  soldQuantity?: number;
}

export interface DataProductBasic {
  categoryId: string;
  subCategoryId: string;
  segmentId: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
}

export interface DataProductSale {
  discount?: number;
  variants?: IVariant[];
}

export interface IProductResponse {
  id: string;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  isArchived: boolean;
  discount: number;
  totalQuantity: number;
  totalSoldQuantity: number;
  totalInventory: number;
  createdAt: string;
  updatedAt: string;
  segment: ISegment; // Quan hệ với segment
  variants: IVariant[]; // Danh sách các biến thể
}

export interface ISegment {
  id: string;
  name: string;
  slug: string;
  category: ICategory; // Quan hệ với category
}

export interface ICategory {
  id: string;
  name: string;
  cateSlug: string;
  subCategory: ISubCategory; // Quan hệ với subCategory
}

export interface ISubCategory {
  id: string;
  name: string;
  subCateSlug: string;
}

export interface IVariant {
  id: string;
  color: string;
  isActive: boolean;
  sizes: ISize[]; // Danh sách kích thước
  images: IImage[]; // Danh sách hình ảnh
}

export interface ISize {
  id: string;
  size: string;
  quantity: number;
  isActive: boolean;
}

export interface IImage {
  id: string;
  url: string;
}

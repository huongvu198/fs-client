export type ISubcategory = {
  id: string;
  name: string;
  subCateSlug: string;
  isActive: boolean;
};

export type ICategory = {
  id: string;
  name: string;
  cateSlug: string;
  isActive: boolean;
  subCategories?: ISubcategory[];
};

export type ISegment = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  categories?: ICategory[];
  createdAt: string;
  updatedAt: string;
};

export interface SubCategory {
  id: string;
  name: string;
  subCateSlug: string;
  isActive: boolean;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  cateSlug: string;
  isActive: boolean;
  segmentId: string;
  subCategories: SubCategory[];
}

export interface Segment {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSegmentPayload {
  name: string;
}

export interface UpdateSegmentPayload {
  name: string;
  isActive: boolean;
}
export interface UpdateCategoryPayload {
  segmentId: string;
  name: string;
  isActive: boolean;
}

export interface UpdateSubCategoryPayload {
  categoryId: string;
  segmentId: string;
  name: string;
  isActive: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  segmentId: string;
}

export interface CreateSubCategoryPayload {
  name: string;
  segmentId: string;
  categoryId: string;
}

export interface CreateCategoryResponse {
  id: string;
  name: string;
  cateSlug: string;
  segmentId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateSubCategoryResponse {
  id: string;
  name: string;
  subCateSlug: string;
  categoryId: string; // ID của category mà subcategory thuộc về
  segmentId: string; // ID của segment mà subcategory thuộc về
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string;
  deletedAt: string | null; // Null nếu chưa bị xóa
}

export interface UpdateCategoryResponse {
  id: string;
  name: string;
  cateSlug: string;
  segmentId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UpdateSubCategoryResponse {
  id: string;
  name: string;
  subCateSlug: string;
  categoryId: string; // ID của category mà subcategory thuộc về
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string;
  deletedAt: string | null; // Null nếu chưa bị xóa
}

interface ChildItem {
  id: string;
  name: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  children: ChildItem[];
}

import { EventType } from "shared/enum";

export interface Pagination {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
}

export interface PaginatedResponse<T> {
  headers: {
    "x-next-page": number | string;
    "x-page": number | string;
    "x-pages-count": number | string;
    "x-per-page": number | string;
    "x-total-count": number | string;
  };
  items: T[];
}

export interface DecodedToken {
  userId: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export interface EventLink {
  key: string;
  type: "link";
  label: string;
  eventType: EventType;
  pid: string | null;
}

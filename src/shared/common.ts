import { Pagination } from "interfaces/app.interface";
import parsePhoneNumberFromString from "libphonenumber-js";

export const parsePaginationHeaders = (
  headers: Record<string, string | number>
): Pagination => {
  return {
    currentPage: Number(headers["x-page"] || 1),
    totalPages: Number(headers["x-pages-count"] || 1),
    perPage: Number(headers["x-per-page"] || 10),
    totalItems: Number(headers["x-total-count"] || 0),
  };
};

type DiscountResult = {
  originalPrice: number;
  discountPercentage: number;
  currentPrice: number;
};

export function calculateDiscountedPrice(
  price: number,
  discount: number
): DiscountResult {
  const currentPrice = Math.round(price * (1 - discount / 100));
  return {
    originalPrice: price,
    discountPercentage: discount,
    currentPrice,
  };
}

export const mapVariants = <T>(
  variants: any[],
  mapFn: (variant: any) => T | T[]
): T[] => {
  return variants.flatMap(mapFn);
};

export function formatPhoneInternal(phone: string) {
  const phoneNumber = parsePhoneNumberFromString(phone, "VN");
  if (!phoneNumber) return phone;
  return phoneNumber.format("E.164");
}

export const formatDateToVietnamese = (date: string | Date): string => {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const convertSlugToUpperCase = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");
};

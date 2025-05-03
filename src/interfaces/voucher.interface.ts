import { DiscountType } from "shared/enum";

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  type: DiscountType;
  startDate: string;
  endDate: string;
}

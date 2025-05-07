import { Item } from "./item";
import { Worksite } from "./worksite";

export type CartStatus = "EXPORTED" | "ARCHIVED" | "PENDING";

export type Cart = {
  _id?: string;
  cartStatus: CartStatus;
  date: Date;
  items: Item[];
  worksite: Worksite;
  operator?: string;
};

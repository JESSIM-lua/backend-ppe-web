import { Worksite } from "../models/worksite";
import { Cart, CartStatus } from "../models/cart";
import { WorksiteStatus } from "../models/worksite";

let worksites: Worksite[] = [];
let carts: Cart[] = [];

export const resolvers = {
  Query: {
    worksites: (
      _: unknown,
      { worksiteStatuses }: { worksiteStatuses: string[] }
    ): Worksite[] => {
      return worksites.filter((w) =>
        worksiteStatuses.includes(w.worksiteStatus)
      );
    },

    Carts: (_: unknown, { cartStatuses }: { cartStatuses: string[] }): Cart[] =>
      carts.filter((c) => cartStatuses.includes(c.cartStatus)),
  },

  Mutation: {
    addWorksite: (
      _: unknown,
      { worksiteData }: { worksiteData: Omit<Worksite, "_id"> }
    ): Worksite => {
      const newWorksite: Worksite = {
        _id: Date.now().toString(),
        ...worksiteData,
        worksiteStatus: WorksiteStatus.PENDING,
      };
      worksites.push(newWorksite);
      return newWorksite;
    },

    updateWorksite: (
      _: unknown,
      { worksiteData }: { worksiteData: Partial<Worksite> & { _id: string } }
    ): Worksite => {
      const idx = worksites.findIndex((w) => w._id === worksiteData._id);
      if (idx !== -1) {
        worksites[idx] = { ...worksites[idx], ...worksiteData };
        return worksites[idx];
      }
      throw new Error("Worksite not found");
    },

    deleteWorksite: (
      _: unknown,
      { worksiteID }: { worksiteID: string }
    ): Worksite => {
      const idx = worksites.findIndex((w) => w._id === worksiteID);
      const removed = worksites.splice(idx, 1);
      if (removed.length === 0) throw new Error("Worksite not found");
      return removed[0];
    },

    addCart: (
      _: unknown,
      {
        newCart,
      }: {
        newCart: {
          items: Cart["items"];
          cartStatus?: string;
          date: string;
          operator?: string;
          worksiteId: string;
        };
      }
    ): Cart => {
      const foundWorksite = worksites.find((w) => w._id === newCart.worksiteId);

      const fallbackWorksite = {
        _id: newCart.worksiteId,
        name: "Inconnu",
        startDate: undefined,
        endDate: undefined,
        worksiteStatus: WorksiteStatus.PENDING,
      };

      const cart: Cart = {
        _id: Date.now().toString(),
        items: newCart.items,
        cartStatus: (newCart.cartStatus as CartStatus) ?? "PENDING",
        date: new Date(newCart.date),
        operator: newCart.operator ?? "Inconnu",
        worksite: foundWorksite ?? fallbackWorksite,
      };

      carts.push(cart);
      return cart;
    },

    updateCart: (
      _: unknown,
      { cartData }: { cartData: Partial<Cart> & { _id: string } }
    ): Cart => {
      const idx = carts.findIndex((c) => c._id === cartData._id);
      if (idx !== -1) {
        carts[idx] = { ...carts[idx], ...cartData };
        return carts[idx];
      }
      throw new Error("Cart not found");
    },

    deleteCart: (_: unknown, { CartID }: { CartID: string }): Cart => {
      const idx = carts.findIndex((c) => c._id === CartID);
      const removed = carts.splice(idx, 1);
      if (removed.length === 0) throw new Error("Cart not found");
      return removed[0];
    },
  },
};

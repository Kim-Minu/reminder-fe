import api from "@/shared/lib/api";
import type { CartWeek, CreateCartItemRequest, UpdateCartItemRequest } from "../types";

export const cartService = {
  getByMonth: async (year: number, month: number): Promise<CartWeek[]> => {
    const { data } = await api.get<CartWeek[]>(`/api/cart`, { params: { year, month } });
    return data;
  },

  createWeek: async (year: number, month: number, weekOfMonth: number): Promise<CartWeek> => {
    const { data } = await api.post<CartWeek>(`/api/cart/weeks`, { year, month, weekOfMonth });
    return data;
  },

  createItem: async (weekId: number, payload: CreateCartItemRequest) => {
    const { data } = await api.post(`/api/cart/weeks/${weekId}/items`, payload);
    return data;
  },

  updateItem: async (id: number, payload: UpdateCartItemRequest) => {
    const { data } = await api.put(`/api/cart/items/${id}`, payload);
    return data;
  },

  deleteItem: async (id: number): Promise<void> => {
    await api.delete(`/api/cart/items/${id}`);
  },

  toggleCheck: async (id: number) => {
    const { data } = await api.patch(`/api/cart/items/${id}/check`);
    return data;
  },

  deleteChecked: async (weekId: number): Promise<void> => {
    await api.delete(`/api/cart/weeks/${weekId}/checked`);
  },
};

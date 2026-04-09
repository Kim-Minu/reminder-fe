import api from "@/shared/lib/api";
import type { CreateReminderListRequest, ReminderList, UpdateReminderListRequest } from "../types";

export const reminderListService = {
  getAll: async (): Promise<ReminderList[]> => {
    const { data } = await api.get<ReminderList[]>("/api/reminder-lists");
    return data;
  },

  create: async (payload: CreateReminderListRequest): Promise<ReminderList> => {
    const { data } = await api.post<ReminderList>("/api/reminder-lists", payload);
    return data;
  },

  update: async (id: number, payload: UpdateReminderListRequest): Promise<ReminderList> => {
    const { data } = await api.put<ReminderList>(`/api/reminder-lists/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/reminder-lists/${id}`);
  },
};

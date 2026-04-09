import api from "@/shared/lib/api";
import type { CreateReminderRequest, Reminder, UpdateReminderRequest } from "../types";

export const reminderService = {
  getByListId: async (listId: number): Promise<Reminder[]> => {
    const { data } = await api.get<Reminder[]>(`/api/reminder-lists/${listId}/reminders`);
    return data;
  },

  create: async (listId: number, payload: CreateReminderRequest): Promise<Reminder> => {
    const { data } = await api.post<Reminder>(
      `/api/reminder-lists/${listId}/reminders`,
      payload
    );
    return data;
  },

  update: async (id: number, payload: UpdateReminderRequest): Promise<Reminder> => {
    const { data } = await api.put<Reminder>(`/api/reminder-lists/${id}`, payload);
    return data;
  },

  delete: async (id: number, listId: number): Promise<void> => {
    await api.delete(`/api/reminder-lists/${listId}/reminders/${id}`);
  },

  toggleComplete: async (id: number, listId: number): Promise<Reminder> => {
    const { data } = await api.patch<Reminder>(`/api/reminder-lists/${listId}/reminders/${id}/complete`);
    return data;
  },
};

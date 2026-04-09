import api from "@/shared/lib/api";
import type { CreateReminderRequest, Reminder } from "../types";

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
};

export interface ReminderList {
  id: number;
  name: string;
  color: string;
  displayOrder: number;
  reminderCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderListRequest {
  name: string;
  color?: string;
}

export interface UpdateReminderListRequest {
  name: string;
  color: string;
  displayOrder: number;
}

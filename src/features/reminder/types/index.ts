export interface Reminder {
  id: number;
  listId: number;
  title: string;
  isCompleted: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderRequest {
  title: string;
}

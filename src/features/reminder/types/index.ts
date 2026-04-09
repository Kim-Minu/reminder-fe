export interface Reminder {
  id: number;
  listId: number;
  title: string;
  notes?: string;
  isCompleted: boolean;
  isFlagged: boolean;
  priority: 0 | 1 | 2 | 3;
  dueDate?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderRequest {
  title: string;
}

export interface UpdateReminderRequest {
  title: string;
  notes?: string;
  isFlagged?: boolean;
  priority?: 0 | 1 | 2 | 3;
  dueDate?: string;
}

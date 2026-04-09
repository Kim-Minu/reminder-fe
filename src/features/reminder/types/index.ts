export interface Reminder {
  id: number;
  listId: number;
  title: string;
  notes?: string;
  isCompleted: boolean;
  isFlagged: boolean;
  priority: priority;
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
  priority?: priority;
  dueDate?: string;
}

export enum priority {
  NONE,
  LOW,
  MEDIUM,
  HIGH
}
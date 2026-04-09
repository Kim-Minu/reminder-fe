import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reminderService } from "../services/reminderService";
import type {Reminder, UpdateReminderRequest} from "../types";

const remindersKey = (listId: number) => ["reminders", listId] as const;

export function useGetReminders(listId: number | null) {
  return useQuery({
    queryKey: remindersKey(listId!),
    queryFn: () => reminderService.getByListId(listId!),
    enabled: listId !== null,
  });
}

export function useCreateReminder(listId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string }) => reminderService.create(listId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersKey(listId) });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

export function useUpdateReminder(listId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & UpdateReminderRequest) =>
      reminderService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: remindersKey(listId) }),
  });
}

export function useDeleteReminder(listId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reminderService.delete(id, listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersKey(listId) });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

export function useToggleComplete(listId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reminderService.toggleComplete(id, listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersKey(listId) });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

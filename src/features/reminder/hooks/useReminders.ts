import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reminderService } from "../services/reminderService";

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

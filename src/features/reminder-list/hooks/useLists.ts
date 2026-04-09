import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reminderListService } from "../services/reminderListService";
import type { CreateReminderListRequest, UpdateReminderListRequest } from "../types";

const LISTS_KEY = ["lists"] as const;

export function useGetLists() {
  return useQuery({
    queryKey: LISTS_KEY,
    queryFn: reminderListService.getAll,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReminderListRequest) => reminderListService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LISTS_KEY }),
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & UpdateReminderListRequest) =>
      reminderListService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LISTS_KEY }),
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reminderListService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LISTS_KEY }),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cartService";
import type { CreateCartItemRequest, UpdateCartItemRequest, SetBudgetRequest } from "../types";

const cartKey = (year: number, month: number) => ["cart", year, month] as const;

export function useGetCartByMonth(year: number, month: number) {
  return useQuery({
    queryKey: cartKey(year, month),
    queryFn: () => cartService.getByMonth(year, month),
  });
}

export function useCreateWeek(year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weekOfMonth: number) => cartService.createWeek(year, month, weekOfMonth),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKey(year, month) }),
  });
}

export function useCreateItem(year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ weekId, ...payload }: { weekId: number } & CreateCartItemRequest) =>
      cartService.createItem(weekId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKey(year, month) }),
  });
}

export function useUpdateItem(year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & UpdateCartItemRequest) =>
      cartService.updateItem(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKey(year, month) }),
  });
}

export function useDeleteItem(year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cartService.deleteItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKey(year, month) }),
  });
}

export function useToggleCheck(year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cartService.toggleCheck(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKey(year, month) }),
  });
}

export function useDeleteChecked(year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weekId: number) => cartService.deleteChecked(weekId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKey(year, month) }),
  });
}

export function useSetBudget(year: number, month: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ weekId, ...payload }: { weekId: number } & SetBudgetRequest) =>
      cartService.setBudget(weekId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cartKey(year, month) }),
  });
}

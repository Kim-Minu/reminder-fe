import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "../services/budgetService";
import type { SetYearlyBudgetRequest, SetMonthlyBudgetRequest } from "../types";

const budgetKey = (year: number) => ["budgets", year] as const;

export function useGetBudgetByYear(year: number) {
  return useQuery({
    queryKey: budgetKey(year),
    queryFn: () => budgetService.getByYear(year),
  });
}

export function useSetYearlyBudget(year: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetYearlyBudgetRequest) => budgetService.setYearly(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: budgetKey(year) }),
  });
}

export function useSetMonthlyBudget(year: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetMonthlyBudgetRequest) => budgetService.setMonthly(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: budgetKey(year) }),
  });
}

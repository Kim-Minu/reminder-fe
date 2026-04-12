import api from "@/shared/lib/api";
import type { BudgetYear, SetYearlyBudgetRequest, SetMonthlyBudgetRequest } from "../types";

export const budgetService = {
  getByYear: async (year: number): Promise<BudgetYear> => {
    const { data } = await api.get<BudgetYear>(`/api/budgets`, { params: { year } });
    return data;
  },

  setYearly: async (payload: SetYearlyBudgetRequest): Promise<BudgetYear> => {
    const { data } = await api.put<BudgetYear>(`/api/budgets/yearly`, payload);
    return data;
  },

  setMonthly: async (payload: SetMonthlyBudgetRequest): Promise<BudgetYear> => {
    const { data } = await api.put<BudgetYear>(`/api/budgets/monthly`, payload);
    return data;
  },
};

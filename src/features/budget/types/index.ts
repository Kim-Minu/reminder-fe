export interface BudgetMonth {
  month: number; // 1-12
  amount: number | null; // null = 연간 예산 미적용
  cartTotal: number;   // 해당 월 장바구니 실지출 합산
}

export interface BudgetYear {
  year: number;
  yearlyAmount: number | null; // 연간 일괄 예산 (null = 미설정)
  months: BudgetMonth[];
}

export interface SetYearlyBudgetRequest {
  year: number;
  amount: number;
}

export interface SetMonthlyBudgetRequest {
  year: number;
  month: number;
  amount: number;
}

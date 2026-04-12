"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Pencil, Check, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetCartByMonth,
  useCreateWeek,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  useToggleCheck,
  useSetBudget,
} from "../hooks/useCart";
import { useGetBudgetByYear, useSetMonthlyBudget } from "@/features/budget/hooks/useBudget";
import WeekReceipt from "./WeekReceipt";

function getWeekRange(year: number, month: number, weekOfMonth: number): string {
  const daysInMonth = new Date(year, month, 0).getDate();
  const start = (weekOfMonth - 1) * 7 + 1;
  const end = Math.min(weekOfMonth * 7, daysInMonth);
  return `${month}월 ${start}일 - ${end}일`;
}

function getWeeksInMonth(year: number, month: number): number[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const count = Math.ceil(daysInMonth / 7);
  return Array.from({ length: count }, (_, i) => i + 1);
}

function getCurrentWeekOfMonth(): number {
  const now = new Date();
  return Math.ceil(now.getDate() / 7);
}

export default function CartView() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekOfMonth());
  const [budgetEditing, setBudgetEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const queryClient = useQueryClient();
  const { data: weeks = [], isLoading } = useGetCartByMonth(year, month);
  const { data: budgetYear } = useGetBudgetByYear(year);
  const createWeek = useCreateWeek(year, month);
  const createItem = useCreateItem(year, month);
  const updateItem = useUpdateItem(year, month);
  const deleteItem = useDeleteItem(year, month);
  const toggleCheck = useToggleCheck(year, month);
  const setBudget = useSetBudget(year, month);
  const setMonthlyBudget = useSetMonthlyBudget(year);

  const budgetMonth = budgetYear?.months.find(m => m.month === month);
  const monthBudget = budgetMonth?.amount ?? budgetYear?.yearlyAmount ?? null;
  const monthSpent = weeks.reduce((s, w) => s + w.checkedAmount, 0);
  const monthRemain = monthBudget != null ? monthBudget - monthSpent : null;

  const allWeeks = getWeeksInMonth(year, month);
  const activeWeek = weeks.find(w => w.weekOfMonth === selectedWeek);

  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
    setSelectedWeek(1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
    setSelectedWeek(1);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-hidden">
      {/* 월 네비게이션 */}
      <div className="bg-gray-700 text-white px-4 py-2 shrink-0 flex items-center justify-center gap-4">
        <button onClick={prevMonth} className="text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold font-mono tracking-wide">
          {year}년 {month}월
        </span>
        <button onClick={nextMonth} className="text-gray-400 hover:text-white transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 주차 탭 */}
      <div className="bg-gray-800 px-3 pb-0 shrink-0 flex gap-1">
        {allWeeks.map((weekNum) => {
          const exists = weeks.some(w => w.weekOfMonth === weekNum);
          const isActive = selectedWeek === weekNum;
          const isCurrentWeek =
            year === now.getFullYear() &&
            month === now.getMonth() + 1 &&
            weekNum === getCurrentWeekOfMonth();

          return (
            <button
              key={weekNum}
              onClick={() => setSelectedWeek(weekNum)}
              className={`relative px-3 pt-2 pb-2.5 text-xs font-mono font-medium rounded-t-md transition-colors ${
                isActive ? "bg-gray-100 text-gray-800" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {weekNum}주차
              {isCurrentWeek && (
                <span className={`absolute top-1.5 right-1 w-1 h-1 rounded-full ${isActive ? "bg-blue-500" : "bg-blue-400"}`} />
              )}
              {exists && !isActive && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* 예산 요약 바 */}
      <div className="bg-gray-100 px-4 py-2.5 shrink-0 font-mono border-b border-gray-200">
        {budgetEditing ? (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const val = parseInt(budgetInput.replace(/,/g, ""), 10);
              if (!isNaN(val) && val > 0) {
                setMonthlyBudget.mutate(
                  { year, month, amount: val },
                  { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets", year] }) },
                );
              }
              setBudgetEditing(false);
              setBudgetInput("");
            }}
          >
            <span className="text-[10px] text-gray-400 tracking-widest uppercase shrink-0">{month}월 예산</span>
            <input
              autoFocus
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") { setBudgetEditing(false); setBudgetInput(""); } }}
              className="flex-1 text-right text-[11px] border-b border-gray-400 outline-none bg-transparent text-gray-700 py-0.5"
              placeholder="예산 금액"
            />
            <button type="submit" className="text-emerald-500 hover:text-emerald-600"><Check size={13} /></button>
            <button type="button" onClick={() => { setBudgetEditing(false); setBudgetInput(""); }} className="text-gray-300 hover:text-gray-500"><X size={13} /></button>
          </form>
        ) : monthBudget != null ? (
          <>
            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="tracking-widest uppercase">예산</span>
                <button
                  onClick={() => { setBudgetEditing(true); setBudgetInput(String(monthBudget)); }}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <Pencil size={10} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span>지출 ₩{monthSpent.toLocaleString("ko-KR")}</span>
                <span className="text-gray-300">/</span>
                <span>₩{monthBudget.toLocaleString("ko-KR")}</span>
                <span className={monthRemain != null && monthRemain < 0 ? "text-red-400 font-medium" : "text-emerald-500 font-medium"}>
                  {monthRemain != null && monthRemain < 0
                    ? `초과 ₩${Math.abs(monthRemain).toLocaleString("ko-KR")}`
                    : `잔액 ₩${(monthRemain ?? 0).toLocaleString("ko-KR")}`}
                </span>
              </div>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${monthRemain != null && monthRemain < 0 ? "bg-red-400" : "bg-blue-400"}`}
                style={{ width: `${Math.min((monthSpent / monthBudget) * 100, 100)}%` }}
              />
            </div>
          </>
        ) : (
          <button
            onClick={() => setBudgetEditing(true)}
            className="w-full text-[10px] text-gray-300 hover:text-gray-500 tracking-widest text-left transition-colors py-0.5"
          >
            + {month}월 예산 설정
          </button>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-3 py-1">
        {isLoading ? (
          <p className="text-center text-sm text-gray-400 font-mono mt-8">불러오는 중...</p>
        ) : activeWeek ? (
          <WeekReceipt
            week={activeWeek}
            weekRange={getWeekRange(year, month, activeWeek.weekOfMonth)}
            onAddItem={(weekId, name, quantity, unitPrice) =>
              createItem.mutateAsync({ weekId, name, quantity, unitPrice })
            }
            onToggle={(id) => toggleCheck.mutate(id, {
              onSuccess: () => queryClient.invalidateQueries({ queryKey: ["budgets", year] }),
            })}
            onDelete={(id) => deleteItem.mutate(id)}
            onUpdate={(id, name, quantity, unitPrice) =>
              updateItem.mutate({ id, name, quantity, unitPrice })
            }
            onSetBudget={(weekId, budget) => setBudget.mutate({ weekId, budget })}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 font-mono">
            <p className="text-xs text-gray-400 text-center">
              {month}월 {selectedWeek}주차<br />
              <span className="text-gray-300">{getWeekRange(year, month, selectedWeek)}</span>
            </p>
            <button
              onClick={() => createWeek.mutate(selectedWeek)}
              disabled={createWeek.isPending}
              className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <Plus size={13} />
              {selectedWeek}주차 장바구니 만들기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

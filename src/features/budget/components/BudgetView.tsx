"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Check, X } from "lucide-react";
import {
  useGetBudgetByYear,
  useSetYearlyBudget,
  useSetMonthlyBudget,
} from "../hooks/useBudget";

const MONTH_LABELS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

export default function BudgetView() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());

  const [yearlyEditing, setYearlyEditing] = useState(false);
  const [yearlyInput, setYearlyInput] = useState("");
  const [monthlyEditing, setMonthlyEditing] = useState<number | null>(null);
  const [monthlyInput, setMonthlyInput] = useState("");

  const { data, isLoading } = useGetBudgetByYear(year);
  const setYearly = useSetYearlyBudget(year);
  const setMonthly = useSetMonthlyBudget(year);

  const totalBudget = data?.months.reduce((s, m) => s + (m.amount ?? data.yearlyAmount ?? 0), 0) ?? 0;
  const totalSpent = data?.months.reduce((s, m) => s + m.cartTotal, 0) ?? 0;

  const handleYearlySubmit = () => {
    const amount = parseInt(yearlyInput.replace(/,/g, ""), 10);
    if (isNaN(amount) || amount <= 0) return;
    setYearly.mutate({ year, amount }, {
      onSuccess: () => { setYearlyEditing(false); setYearlyInput(""); },
    });
  };

  const handleMonthlySubmit = (month: number) => {
    const amount = parseInt(monthlyInput.replace(/,/g, ""), 10);
    if (isNaN(amount) || amount <= 0) return;
    setMonthly.mutate({ year, month, amount }, {
      onSuccess: () => { setMonthlyEditing(null); setMonthlyInput(""); },
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 overflow-hidden font-mono">
      {/* 연도 네비게이션 */}
      <div className="bg-gray-700 text-white px-4 py-2 shrink-0 flex items-center justify-center gap-4">
        <button onClick={() => setYear(y => y - 1)} className="text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold tracking-wide">{year}년</span>
        <button onClick={() => setYear(y => y + 1)} className="text-gray-400 hover:text-white transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 ">

        {/* 연간 요약 카드 */}
        <div className="bg-white rounded-sm shadow-md overflow-hidden ">
          <Zigzag />
          <div className="px-4 py-4">
            {/* 연간 예산 설정 */}
            <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2 mb-3 ">
              <span className="text-[10px] text-gray-400 tracking-widest uppercase">{year}년 월간 예산</span>
              {yearlyEditing ? (
                <div className="flex items-center gap-1.5">
                  <input
                    autoFocus
                    type="number"
                    value={yearlyInput}
                    onChange={(e) => setYearlyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleYearlySubmit();
                      if (e.key === "Escape") { setYearlyEditing(false); setYearlyInput(""); }
                    }}
                    className="w-28 text-right text-[11px] border-b border-gray-300 outline-none bg-transparent text-gray-700 py-0.5"
                    placeholder="월 예산 금액"
                  />
                  <button onClick={handleYearlySubmit} className="text-emerald-500 hover:text-emerald-600"><Check size={13} /></button>
                  <button onClick={() => { setYearlyEditing(false); setYearlyInput(""); }} className="text-gray-300 hover:text-gray-500"><X size={13} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-700">
                    {data?.yearlyAmount != null ? `₩${data.yearlyAmount.toLocaleString("ko-KR")} / 월` : "—"}
                  </span>
                  <button
                    onClick={() => { setYearlyEditing(true); setYearlyInput(data?.yearlyAmount != null ? String(data.yearlyAmount) : ""); }}
                    className="text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    <Pencil size={11} />
                  </button>
                </div>
              )}
            </div>

            {/* 연간 합계 */}
            <div className="grid grid-cols-3 divide-x divide-dashed divide-gray-200">
              <SummaryCell label="연 예산" value={totalBudget} />
              <SummaryCell label="연 지출" value={totalSpent} color="text-red-500" />
              <SummaryCell
                label={totalSpent <= totalBudget ? "잔액" : "초과"}
                value={Math.abs(totalBudget - totalSpent)}
                color={totalSpent <= totalBudget ? "text-emerald-500" : "text-red-500"}
              />
            </div>
            {totalBudget > 0 && (
              <div className="mt-3">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${totalSpent > totalBudget ? "bg-red-400" : "bg-blue-400"}`}
                    style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[9px] text-gray-400 text-right mt-0.5">
                  {Math.round((totalSpent / totalBudget) * 100)}% 사용
                </p>
              </div>
            )}
          </div>
          <Zigzag inverted />
        </div>

        {/* 월별 목록 */}
        <div className="bg-white rounded-sm shadow-md overflow-hidden">
          <Zigzag />
          <div className="px-4 pt-3 pb-1">
            <p className="text-[10px] text-gray-400 tracking-widest uppercase border-b border-dashed border-gray-200 pb-1.5">
              월별 예산
            </p>
          </div>

          <div className="px-4 pb-3">
            {isLoading && (
              <p className="text-[11px] text-gray-300 py-4 text-center">불러오는 중...</p>
            )}
            {!isLoading && data?.months.map((m) => {
              const budget = m.amount ?? data.yearlyAmount;
              const isOver = budget != null && m.cartTotal > budget;
              const ratio = budget != null && budget > 0 ? Math.min(m.cartTotal / budget, 1) : 0;
              const isEditing = monthlyEditing === m.month;
              const isCurrentMonth = m.month === now.getMonth() + 1 && year === now.getFullYear();

              return (
                <div key={m.month} className={`py-2 border-b border-dashed border-gray-100 last:border-0 ${isCurrentMonth ? "bg-blue-50/40" : ""}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] w-6 shrink-0 ${isCurrentMonth ? "text-blue-500 font-bold" : "text-gray-400"}`}>
                      {MONTH_LABELS[m.month - 1]}
                    </span>

                    {isEditing ? (
                      <div className="flex flex-1 items-center gap-1.5">
                        <input
                          autoFocus
                          type="number"
                          value={monthlyInput}
                          onChange={(e) => setMonthlyInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleMonthlySubmit(m.month);
                            if (e.key === "Escape") { setMonthlyEditing(null); setMonthlyInput(""); }
                          }}
                          className="flex-1 text-right text-[11px] border-b border-gray-300 outline-none bg-transparent text-gray-700 py-0.5"
                          placeholder="예산 금액"
                        />
                        <button onClick={() => handleMonthlySubmit(m.month)} className="text-emerald-500 hover:text-emerald-600"><Check size={13} /></button>
                        <button onClick={() => { setMonthlyEditing(null); setMonthlyInput(""); }} className="text-gray-300 hover:text-gray-500"><X size={13} /></button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          {budget != null ? (
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${isOver ? "bg-red-400" : "bg-blue-400"}`}
                                style={{ width: `${ratio * 100}%` }}
                              />
                            </div>
                          ) : (
                            <span className="text-[9px] text-gray-300">예산 미설정</span>
                          )}
                        </div>
                        <span className={`text-[10px] ${isOver ? "text-red-400" : "text-gray-500"} shrink-0`}>
                          ₩{m.cartTotal.toLocaleString("ko-KR")}
                          {budget != null && <span className="text-gray-300 mx-0.5">/</span>}
                          {budget != null && `₩${budget.toLocaleString("ko-KR")}`}
                          {m.amount != null && data?.yearlyAmount != null && (
                            <span className="ml-1 text-[8px] text-blue-400">개별</span>
                          )}
                        </span>
                        <button
                          onClick={() => { setMonthlyEditing(m.month); setMonthlyInput(budget != null ? String(budget) : ""); }}
                          className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
                        >
                          <Pencil size={11} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Zigzag inverted />
        </div>
      </div>
    </div>
  );
}

function SummaryCell({ label, value, color = "text-gray-800" }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex flex-col items-center px-2 py-1 gap-0.5">
      <span className="text-[9px] text-gray-400 tracking-widest uppercase">{label}</span>
      <span className={`text-xs font-bold ${color}`}>₩{value.toLocaleString("ko-KR")}</span>
    </div>
  );
}

function Zigzag({ inverted = false }: { inverted?: boolean }) {
  const count = 28;
  const w = count * 14;
  const points = Array.from({ length: count }, (_, i) => {
    const x1 = i * 14, x2 = i * 14 + 7, x3 = i * 14 + 14;
    return inverted ? `${x1},0 ${x2},8 ${x3},0` : `${x1},8 ${x2},0 ${x3},8`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} 8`} className="w-full" preserveAspectRatio="none" style={{ height: 8, display: "block" }}>
      <polyline points={points} fill="none" stroke="#e5e7eb" strokeWidth="1" />
    </svg>
  );
}

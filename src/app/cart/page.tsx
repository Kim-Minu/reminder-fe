"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  useGetCartByMonth,
  useCreateWeek,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  useToggleCheck,
} from "@/features/cart/hooks/useCart";
import WeekReceipt from "@/features/cart/components/WeekReceipt";

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

export default function CartPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekOfMonth());

  const { data: weeks = [], isLoading } = useGetCartByMonth(year, month);
  const createWeek = useCreateWeek(year, month);
  const createItem = useCreateItem(year, month);
  const updateItem = useUpdateItem(year, month);
  const deleteItem = useDeleteItem(year, month);
  const toggleCheck = useToggleCheck(year, month);

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
                isActive
                  ? "bg-gray-100 text-gray-800"
                  : "text-gray-400 hover:text-gray-200"
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

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {isLoading ? (
          <p className="text-center text-sm text-gray-400 font-mono mt-8">불러오는 중...</p>
        ) : activeWeek ? (
          <WeekReceipt
            week={activeWeek}
            weekRange={getWeekRange(year, month, activeWeek.weekOfMonth)}
            onAddItem={(weekId, name, quantity, unitPrice) =>
              createItem.mutateAsync({ weekId, name, quantity, unitPrice })
            }
            onToggle={(id) => toggleCheck.mutate(id)}
            onDelete={(id) => deleteItem.mutate(id)}
            onUpdate={(id, name, quantity, unitPrice) =>
              updateItem.mutate({ id, name, quantity, unitPrice })
            }
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

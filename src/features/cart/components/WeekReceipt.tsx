"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import type { CartWeek } from "../types";
import CartItemRow from "./CartItemRow";
import InlineCartInput from "./InlineCartInput";

interface Props {
  week: CartWeek;
  weekRange: string;
  onAddItem: (weekId: number, name: string, quantity: number, unitPrice: number) => Promise<void>;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string, quantity: number, unitPrice: number) => void;
  onSetBudget: (weekId: number, budget: number) => void;
}

const Zigzag = ({ inverted = false }: { inverted?: boolean }) => {
  const count = 28;
  const w = count * 14;
  const points = Array.from({ length: count }, (_, i) => {
    const x1 = i * 14;
    const x2 = i * 14 + 7;
    const x3 = i * 14 + 14;
    return inverted
      ? `${x1},0 ${x2},8 ${x3},0`
      : `${x1},8 ${x2},0 ${x3},8`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} 8`}
      className="w-full"
      preserveAspectRatio="none"
      style={{ height: 8, display: "block" }}
    >
      <polyline points={points} fill="none" stroke="#e5e7eb" strokeWidth="1" />
    </svg>
  );
};

export default function WeekReceipt({
  week,
  weekRange,
  onAddItem,
  onToggle,
  onDelete,
  onUpdate,
  onSetBudget,
}: Props) {
  const checkedCount = week.items.filter((i) => i.isChecked).length;
  const [budgetEditing, setBudgetEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  return (
    <div className="bg-white rounded-sm shadow-md overflow-hidden font-mono  min-h-full flex flex-col">
      {/* 상단 절취선 */}
      <Zigzag />

      {/* 헤더 */}
      <div className="bg-gray-800 text-white px-3 py-2 text-center">
        <p className="text-[10px] text-gray-400 mt-0.5">{weekRange}</p>
      </div>

      {/* 컬럼 헤더 */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex gap-2 items-center text-[10px] text-gray-400 tracking-widest uppercase border-b border-dashed border-gray-200 pb-1.5">
          <span className="w-3.5 shrink-0" />
          <span className="flex-1">품명</span>
          <span className="w-10 flex justify-end">수량</span>
          <span className="w-16 flex justify-end">단가</span>
          <span className="w-16 flex justify-end">소계</span>
          <span className="w-7 shrink-0" />
        </div>
      </div>

      {/* 아이템 목록 */}
      <div className="px-4 pb-2 min-h-[30vh] max-h-[30vh] overflow-y-auto">
        {week.items.length === 0 && (
          <p className="text-[11px] text-gray-300 py-2 text-center tracking-wide">— 항목 없음 —</p>
        )}
        {week.items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}

        <InlineCartInput
          onSubmit={(name, qty, price) => onAddItem(week.id, name, qty, price)}
        />
      </div>

      {/* 합계 */}
      <div className="px-4">
        <div className="border-t-2 border-double border-gray-300 pt-2 pb-3">
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium py-0.5">
            <span className="tracking-widest uppercase">총 수량</span>
            <span>{week.items.length}개</span>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium py-0.5">
            <span>지출 ({checkedCount})</span>
            <span>₩{week.checkedAmount.toLocaleString("ko-KR")}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium py-0.5">
            <span>지출 예정 ({week.items.length - checkedCount})</span>
            <span>₩{(week.totalAmount - week.checkedAmount).toLocaleString("ko-KR")}</span>
          </div>
          <hr className="border-t-2 border-double border-gray-300 my-1.5" />
          <div className="flex justify-between items-center py-0.5">
            <span className="text-sm font-bold tracking-widest uppercase text-gray-800">Total</span>
            <span className="text-sm font-bold text-gray-800">
              ₩{week.totalAmount.toLocaleString("ko-KR")}
            </span>
          </div>
        </div>
      </div>

      {/* 하단 절취선 */}
      <div className="mt-auto">
        <Zigzag inverted />
      </div>
    </div>
  );
}

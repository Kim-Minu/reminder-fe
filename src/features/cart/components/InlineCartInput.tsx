"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Check, X } from "lucide-react";

interface Props {
  onSubmit: (name: string, quantity: number, unitPrice: number) => Promise<void>;
}

export default function InlineCartInput({ onSubmit }: Props) {
  const [active, setActive] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (active) nameRef.current?.focus();
  }, [active]);

  const reset = () => {
    setName("");
    setQuantity("1");
    setUnitPrice("");
    setActive(false);
  };

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await onSubmit(trimmed, Number(quantity) || 1, Number(unitPrice) || 0);
    setName("");
    setQuantity("1");
    setUnitPrice("");
    nameRef.current?.focus();
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) await submit();
    else if (e.key === "Escape") reset();
  };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-1 font-mono"
      >
        <Plus size={13} />
        항목 추가
      </button>
    );
  }

  return (
    <div className="flex gap-2 items-center text-xs font-mono py-0.5 border-t border-dashed border-gray-200 mt-1 pt-1.5">
      {/* 체크박스 자리 */}
      <div className="w-3.5 h-3.5 shrink-0 rounded-sm border border-dashed border-gray-300" />
      <input
        ref={nameRef}
        className="flex-1 min-w-0 bg-transparent outline-none text-gray-700 placeholder:text-gray-300 border-b border-dashed border-gray-200"
        placeholder="품명"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        className="w-10 bg-transparent outline-none text-right text-gray-700 placeholder:text-gray-300 border-b border-dashed border-gray-200"
        placeholder="1"
        value={quantity}
        type="number"
        min={1}
        onChange={(e) => setQuantity(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        className="w-16 bg-transparent outline-none text-right text-gray-700 placeholder:text-gray-300 border-b border-dashed border-gray-200"
        placeholder="단가"
        value={unitPrice}
        type="number"
        min={0}
        onChange={(e) => setUnitPrice(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <span className="w-16 flex justify-end text-gray-300 text-[10px]">
        {unitPrice ? (Number(quantity || 1) * Number(unitPrice)).toLocaleString("ko-KR") : "-"}
      </span>
      <div className="flex gap-1 w-7 shrink-0 justify-end">
        <button onClick={reset} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={11} />
        </button>
        <button onClick={submit} className="text-blue-500 hover:text-blue-600 transition-colors">
          <Check size={11} />
        </button>
      </div>
    </div>
  );
}

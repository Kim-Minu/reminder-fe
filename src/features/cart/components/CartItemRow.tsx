"use client";

import { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import type { CartItem } from "../types";

interface Props {
  item: CartItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string, quantity: number, unitPrice: number) => void;
}

export default function CartItemRow({ item, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [unitPrice, setUnitPrice] = useState(String(item.unitPrice));

  const cancelEdit = () => {
    setName(item.name);
    setQuantity(String(item.quantity));
    setUnitPrice(String(item.unitPrice));
    setEditing(false);
  };

  const commitEdit = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onUpdate(item.id, trimmed, Number(quantity) || 1, Number(unitPrice) || 0);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) commitEdit();
    else if (e.key === "Escape") cancelEdit();
  };

  if (editing) {
    return (
      <div className="flex gap-2 items-center text-xs font-mono py-0.5 bg-yellow-50 rounded -mx-1 px-1">
        <div className="w-3.5 h-3.5 shrink-0 rounded-sm border border-gray-300 bg-gray-100" />
        <input
          autoFocus
          className="flex-1 min-w-0 border-b border-dashed border-gray-300 bg-transparent outline-none text-gray-700 py-0.5"
          placeholder="품명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          className="w-10 border-b border-dashed border-gray-300 bg-transparent outline-none text-right text-gray-700 py-0.5"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          className="w-16 border-b border-dashed border-gray-300 bg-transparent outline-none text-right text-gray-700 py-0.5"
          type="number"
          min={0}
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="w-16 flex justify-end text-gray-400 text-[10px]">
          {(Number(quantity || 1) * Number(unitPrice || 0)).toLocaleString("ko-KR")}
        </div>
        <div className="flex gap-1 w-7 shrink-0 justify-end">
          <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={11} />
          </button>
          <button onClick={commitEdit} className="text-blue-500 hover:text-blue-600 transition-colors">
            <Check size={11} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex gap-2 items-center text-xs font-mono py-0.5 select-none">
      <button
        onClick={() => onToggle(item.id)}
        className="w-3.5 h-3.5 rounded-sm border border-gray-400 shrink-0 flex items-center justify-center transition-colors hover:border-gray-600"
        style={{ backgroundColor: item.isChecked ? "#6b7280" : "transparent" }}
      >
        {item.isChecked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 truncate text-gray-700">
        {item.name}
      </div>
      <div className="w-10 flex justify-end text-gray-700">{item.quantity}</div>
      <div className="w-16 flex justify-end text-gray-700">
        {item.unitPrice > 0 ? item.unitPrice.toLocaleString("ko-KR") : "-"}
      </div>
      <div className="w-16 flex justify-end text-gray-700 font-medium">
        {item.lineTotal > 0 ? item.lineTotal.toLocaleString("ko-KR") : "-"}
      </div>

      <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="text-gray-500 hover:text-blue-500 transition-colors"
        >
          <Pencil size={11} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

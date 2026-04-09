"use client";

import { useState } from "react";
import { useCreateList } from "../hooks/useLists";
import ColorPicker, { APPLE_COLORS } from "./ColorPicker";

interface Props {
  onClose: () => void;
}

export default function ListFormModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(APPLE_COLORS[7].hex); // Blue 기본값
  const createList = useCreateList();

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await createList.mutateAsync({ name: trimmed, color });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-80 p-6 flex flex-col gap-5">
        {/* 미리보기 */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-12 h-12 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h2 className="text-lg font-semibold text-[#1C1C1E]">새 목록</h2>
        </div>

        {/* 이름 입력 */}
        <input
          autoFocus
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="목록 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {/* 색상 선택 */}
        <ColorPicker value={color} onChange={setColor} />

        {/* 버튼 */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || createList.isPending}
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}

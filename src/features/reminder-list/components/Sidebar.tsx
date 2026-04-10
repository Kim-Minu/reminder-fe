"use client";

import { useState } from "react";
import { Calendar, CalendarClock, List, CheckCircle, Flag, Plus } from "lucide-react";
import { useGetLists } from "../hooks/useLists";
import useUiStore from "../store/uiStore";
import ListFormModal from "./ListFormModal";

const SMART_LISTS = [
  { id: "today",     label: "오늘",     icon: Calendar,     bg: "#007AFF" },
  { id: "scheduled", label: "예정됨",   icon: CalendarClock, bg: "#FF3B30" },
  { id: "all",       label: "전체",     icon: List,         bg: "#8E8E93" },
  { id: "completed", label: "완료됨",   icon: CheckCircle,  bg: "#8E8E93" },
  { id: "flagged",   label: "플래그됨", icon: Flag,         bg: "#FF9500" },
] as const;

type SmartListId = (typeof SMART_LISTS)[number]["id"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const { data: lists, isLoading } = useGetLists();
  const { selectedListId, setSelectedListId } = useUiStore();
  const [smartSelected, setSmartSelected] = useState<SmartListId | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSmartSelect = (id: SmartListId) => {
    setSmartSelected(id);
    setSelectedListId(null);
  };

  const handleListSelect = (id: number) => {
    setSmartSelected(null);
    setSelectedListId(id);
    onClose();
  };

  return (
    <>
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-[#F2F2F7] flex flex-col select-none shrink-0
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:z-auto
      `}>
        {/* 스마트 목록 */}
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-1">
            스마트 목록
          </h2>
        </div>
        <div className="px-2 grid grid-cols-2 gap-1.5">
          {SMART_LISTS.map(({ id, label, icon: Icon, bg }) => (
            <button
              key={id}
              onClick={() => handleSmartSelect(id)}
              className={`flex flex-col items-start gap-1 px-3 py-2.5 rounded-xl transition-colors ${
                smartSelected === id ? "bg-blue-500 text-white" : "bg-white text-[#1C1C1E] hover:bg-white/80"
              }`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: smartSelected === id ? "rgba(255,255,255,0.25)" : bg }}
              >
                <Icon size={14} color="white" />
              </div>
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>

        {/* 나의 목록 */}
        <div className="px-4 pt-5 pb-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-1">
            나의 목록
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto px-2">
          {isLoading && (
            <p className="px-2 py-1 text-sm text-gray-400">불러오는 중...</p>
          )}
          {lists?.map((list) => (
            <button
              key={list.id}
              onClick={() => handleListSelect(list.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedListId === list.id
                  ? "bg-blue-500 text-white"
                  : "text-[#1C1C1E] hover:bg-black/5"
              }`}
            >
              <span
                className="w-6 h-6 rounded-full shrink-0"
                style={{ backgroundColor: list.color }}
              />
              <span className="flex-1 text-sm font-medium truncate">{list.name}</span>
              {list.reminderCount > 0 && (
                <span
                  className={`text-xs font-semibold ${
                    selectedListId === list.id ? "text-white" : "text-gray-500"
                  }`}
                >
                  {list.reminderCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* 하단: 목록 추가 */}
        <div className="px-4 py-4 border-t border-black/5">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
          >
            <Plus size={16} />
            목록 추가
          </button>
        </div>
      </aside>

      {showModal && <ListFormModal onClose={() => setShowModal(false)} />}
    </>
  );
}

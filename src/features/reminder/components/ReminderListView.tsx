"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useGetReminders, useCreateReminder } from "../hooks/useReminders";
import { useGetLists } from "@/features/reminder-list/hooks/useLists";
import useUiStore from "@/features/reminder-list/store/uiStore";

export default function ReminderListView() {
  const { selectedListId } = useUiStore();
  const { data: lists } = useGetLists();
  const { data: reminders, isLoading } = useGetReminders(selectedListId);
  const createReminder = useCreateReminder(selectedListId!);

  const [inputVisible, setInputVisible] = useState(false);
  const [title, setTitle] = useState("");

  const selectedList = lists?.find((l) => l.id === selectedListId);

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await createReminder.mutateAsync({ title: trimmed });
    setTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setTitle("");
      setInputVisible(false);
    }
  };

  if (!selectedListId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        목록을 선택하세요
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="px-8 pt-8 pb-4 shrink-0">
        <h1
          className="text-3xl font-bold"
          style={{ color: selectedList?.color ?? "#007AFF" }}
        >
          {selectedList?.name ?? ""}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {reminders?.filter((r) => !r.isCompleted).length ?? 0}개
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-8">
        {isLoading && <p className="text-sm text-gray-400">불러오는 중...</p>}

        {reminders
          ?.filter((r) => !r.isCompleted)
          .map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center gap-3 py-3 border-b border-gray-100"
            >
              <span
                className="w-5 h-5 rounded-full border-2 shrink-0"
                style={{ borderColor: selectedList?.color ?? "#007AFF" }}
              />
              <span className="text-sm text-[#1C1C1E]">{reminder.title}</span>
            </div>
          ))}

        {!isLoading && !reminders?.length && !inputVisible && (
          <p className="text-sm text-gray-400 py-4">리마인더가 없습니다</p>
        )}

        {inputVisible && (
          <div className="flex items-center gap-3 py-3 border-b border-gray-100">
            <span
              className="w-5 h-5 rounded-full border-2 shrink-0"
              style={{ borderColor: selectedList?.color ?? "#007AFF" }}
            />
            <input
              autoFocus
              className="flex-1 text-sm outline-none bg-transparent"
              placeholder="새 리마인더"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => handleSubmit().finally(() => setInputVisible(false))}
            />
          </div>
        )}
      </div>

      <div className="px-8 py-4 shrink-0">
        <button
          onClick={() => setInputVisible(true)}
          className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 font-medium"
        >
          <Plus size={16} />
          새 리마인더
        </button>
      </div>
    </div>
  );
}

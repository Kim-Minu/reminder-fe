"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { useGetReminders, useCreateReminder, useDeleteReminder, useToggleComplete } from "../hooks/useReminders";
import { useGetLists } from "@/features/reminder-list/hooks/useLists";
import useUiStore from "@/features/reminder-list/store/uiStore";
import ReminderRow from "./ReminderRow";
import InlineReminderInput from "./InlineReminderInput";

interface Props {
  onMenuClick: () => void;
}

export default function ReminderListView({ onMenuClick }: Props) {
  const { selectedListId } = useUiStore();
  const { data: lists } = useGetLists();
  const { data: reminders, isLoading } = useGetReminders(selectedListId);
  const createReminder = useCreateReminder(selectedListId!);
  const deleteReminder = useDeleteReminder(selectedListId!);
  const toggleComplete = useToggleComplete(selectedListId!);

  const [completedOpen, setCompletedOpen] = useState(false);

  const selectedList = lists?.find((l) => l.id === selectedListId);
  const color = selectedList?.color ?? "#007AFF";

  const active = reminders?.filter((r) => !r.isCompleted) ?? [];
  const completed = reminders?.filter((r) => r.isCompleted) ?? [];

  if (!selectedListId) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="px-4 pt-4 pb-2 shrink-0 md:hidden">
          <button onClick={onMenuClick} className="text-gray-500 hover:text-gray-700">
            <Menu size={22} />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          목록을 선택하세요
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="px-4 md:px-8 pt-4 md:pt-8 pb-4 shrink-0">
        <button onClick={onMenuClick} className="mb-3 text-gray-500 hover:text-gray-700 md:hidden">
          <Menu size={22} />
        </button>
        <h1 className="text-3xl font-bold" style={{ color }}>
          {selectedList?.name ?? ""}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{active.length}개</p>
      </header>

      <div className="flex-1 overflow-y-auto px-6">
        {isLoading && <p className="text-sm text-gray-400 px-2 py-2">불러오는 중...</p>}

        {/* 미완료 목록 */}
        {active.map((reminder) => (
          <ReminderRow
            key={reminder.id}
            reminder={reminder}
            color={color}
            onToggleComplete={(id) => toggleComplete.mutate(id)}
            onDelete={(id) => deleteReminder.mutate(id)}
          />
        ))}

        {/* 인라인 입력 */}
        <InlineReminderInput
          color={color}
          onSubmit={(title) => createReminder.mutateAsync({ title })}
        />

        {/* 완료 섹션 */}
        {completed.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setCompletedOpen((v) => !v)}
              className="flex items-center gap-1 text-sm font-semibold text-gray-500 px-2 py-1 hover:text-gray-700 transition-colors"
            >
              {completedOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              완료됨 {completed.length}
            </button>
            {completedOpen &&
              completed.map((reminder) => (
                <ReminderRow
                  key={reminder.id}
                  reminder={reminder}
                  color={color}
                  onToggleComplete={(id) => toggleComplete.mutate(id)}
                  onDelete={(id) => deleteReminder.mutate(id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

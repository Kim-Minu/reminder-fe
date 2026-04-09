"use client";

import { useState } from "react";
import { Flag, MoreHorizontal } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import {priority, Reminder} from "../types";

const PRIORITY_LABELS: Record<number, string> = { 1: "!", 2: "!!", 3: "!!!" };

interface Props {
  reminder: Reminder;
  color: string;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ReminderRow({ reminder, color, onToggleComplete, onDelete }: Props) {
  const [hovered, setHovered] = useState(false);
  const [completing, setCompleting] = useState(false);

  const handleToggle = () => {
    if (completing) return;
    setCompleting(true);
    setTimeout(() => {
      onToggleComplete(reminder.id);
      setCompleting(false);
    }, 300);
  };

  const dueDateLabel = reminder.dueDate
    ? isToday(new Date(reminder.dueDate))
      ? "오늘"
      : format(new Date(reminder.dueDate), "M월 d일")
    : null;
  const isOverdue =
    reminder.dueDate && !reminder.isCompleted && isPast(new Date(reminder.dueDate));

  return (
    <div
      className={`flex items-start gap-3 py-2.5 px-2 rounded-lg transition-colors group ${
        hovered ? "bg-black/[0.03]" : ""
      } ${completing ? "opacity-0 transition-opacity duration-300" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 원형 체크박스 */}
      <button
        onClick={handleToggle}
        className="mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors"
        style={{
          borderColor: color,
          backgroundColor: reminder.isCompleted ? color : "transparent",
        }}
      >
        {reminder.isCompleted && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* 텍스트 */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            reminder.isCompleted ? "line-through text-gray-400" : "text-[#1C1C1E]"
          }`}
        >
          {reminder.title}
        </p>
        {reminder.notes && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{reminder.notes}</p>
        )}
        {dueDateLabel && (
          <p className={`text-xs mt-0.5 ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
            {dueDateLabel}
          </p>
        )}
      </div>

      {/* 우측 메타 */}
      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
        {reminder.priority === priority.HIGH && (
          <span className="text-xs font-bold text-red-500">
            {PRIORITY_LABELS[reminder.priority]}
          </span>
        )}
        {reminder.isFlagged && <Flag size={13} className="text-orange-400 fill-orange-400" />}
        {hovered && (
          <button
            onClick={() => onDelete(reminder.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

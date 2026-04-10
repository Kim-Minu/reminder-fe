"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import {Reminder} from "@/features/reminder";

interface Props {
  color: string;
  onSubmit: (title: string) => Promise<Reminder>;
}

export default function InlineReminderInput({ color, onSubmit }: Props) {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  const submit = async () => {
    const trimmed = title.trim();
    if (trimmed) {
      await onSubmit(trimmed);
      setTitle("");
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      await submit();
    } else if (e.key === "Escape") {
      setTitle("");
      setActive(false);
    }
  };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="flex items-center gap-2 text-sm font-medium px-2 py-2 rounded-lg text-blue-500 hover:text-blue-600 transition-colors"
      >
        <Plus size={16} />
        새 리마인더
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2.5 px-2">
      <span
        className="w-5 h-5 rounded-full border-2 shrink-0"
        style={{ borderColor: color }}
      />
      <input
        ref={inputRef}
        className="flex-1 text-sm outline-none bg-transparent text-[#1C1C1E] placeholder:text-gray-400"
        placeholder="새 리마인더"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={async () => {
          await submit();
          setActive(false);
        }}
      />
    </div>
  );
}

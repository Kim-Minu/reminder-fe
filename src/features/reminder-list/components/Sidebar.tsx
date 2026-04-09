"use client";

import { useGetLists } from "../hooks/useLists";
import useUiStore from "../store/uiStore";

export default function Sidebar() {
  const { data: lists, isLoading } = useGetLists();
  const { selectedListId, setSelectedListId } = useUiStore();

  return (
    <aside className="w-64 h-full bg-[#F2F2F7] flex flex-col select-none shrink-0">
      <div className="px-4 pt-6 pb-2">
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
            onClick={() => setSelectedListId(list.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              selectedListId === list.id
                ? "bg-blue-500 text-white"
                : "text-[#1C1C1E] hover:bg-black/5"
            }`}
          >
            <span
              className="w-7 h-7 rounded-full shrink-0"
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
    </aside>
  );
}

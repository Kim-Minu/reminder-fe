"use client";

import { useState } from "react";
import Sidebar from "@/features/reminder-list/components/Sidebar";
import ReminderListView from "@/features/reminder/components/ReminderListView";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ReminderListView onMenuClick={() => setSidebarOpen(true)} />
      </main>
    </div>
  );
}

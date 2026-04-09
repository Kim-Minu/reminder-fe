import Sidebar from "@/features/reminder-list/components/Sidebar";
import ReminderListView from "@/features/reminder/components/ReminderListView";

export default function Home() {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ReminderListView />
      </main>
    </div>
  );
}

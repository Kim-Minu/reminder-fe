"use client";

import { usePathname } from "next/navigation";
import GlobalHeader from "./GlobalHeader";
import GlobalSidebar from "./GlobalSidebar";
import BottomNav from "./BottomNav";

const AUTH_PATHS = ["/login", "/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-full">
      <GlobalHeader />
      <div className="flex flex-1 overflow-hidden">
        <GlobalSidebar />
        <main className="flex-1 overflow-hidden pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

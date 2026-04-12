"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/features/auth/store/authStore";
import { useLogout } from "@/features/auth/hooks/useAuth";

export default function GlobalHeader() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => router.replace("/login"),
    });
  };

  return (
    <header className="h-12 bg-gray-800 text-white flex items-center px-4 shrink-0 z-10">
      {/* 좌측: 앱 이름 */}
      <div className="flex items-center gap-2 font-mono">
        <span className="text-sm font-semibold tracking-wide">BudgetLab</span>
      </div>

      {/* 우측: 유저 정보 */}
      {user && (
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors"
            title="로그아웃"
          >
            <LogOut size={14} />
          </button>
        </div>
      )}
    </header>
  );
}

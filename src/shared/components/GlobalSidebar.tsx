"use client";

import { ListTodo, ShoppingCart, Home, Wallet, User} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  //{ label: "홈",       icon: Home,         href: "/home" },
  //{ label: "미리알림", icon: ListTodo,         href: "/" },
  { label: "장바구니", icon: ShoppingCart, href: "/cart" },
  { label: "예산",     icon: Wallet,       href: "/budget" },
  //{ label: "마이페이지", icon: User,       href: "/mypage" },
] as const;

export default function GlobalSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="hidden md:flex flex-col w-16 bg-gray-900 shrink-0 py-3 gap-1">
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 mx-1.5 rounded-lg transition-colors ${
              active ? "bg-gray-700 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            }`}
          >
            <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
            <span className="text-[9px] font-medium leading-none">{label}</span>
          </button>
        );
      })}
    </aside>
  );
}

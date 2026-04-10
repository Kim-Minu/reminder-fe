"use client";

import { ListTodo, ShoppingCart, Home, Wallet, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "미리알림", icon: ListTodo,          href: "/" },
  { label: "장바구니", icon: ShoppingCart,  href: "/cart" },
  { label: "홈",       icon: Home,          href: "/home" },
  { label: "예산",     icon: Wallet,        href: "/budget" },
  { label: "MY", icon: User,        href: "/mypage" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex items-center h-16 safe-area-pb">
      {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
          >
            <Icon
              size={22}
              className={active ? "text-blue-500" : "text-gray-400"}
              strokeWidth={active ? 2.2 : 1.8}
            />
            <span
              className={`text-[10px] font-medium ${active ? "text-blue-500" : "text-gray-400"}`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

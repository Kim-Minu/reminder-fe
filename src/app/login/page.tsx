import Link from "next/link";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata = { title: "로그인 — BudgetLab" };

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm px-8 py-10 w-full max-w-sm flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mb-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#1C1C1E]">BudgetLab</h1>
          <p className="text-sm text-gray-400">계속하려면 로그인하세요</p>
        </div>

        <LoginForm />

        <p className="text-sm text-gray-400">
          계정이 없으신가요?{" "}
          <Link href="/register" className="text-blue-500 font-medium hover:underline">
            계정 만들기
          </Link>
        </p>
      </div>
    </div>
  );
}

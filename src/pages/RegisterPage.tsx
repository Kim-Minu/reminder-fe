import Link from "next/link";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
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
          <h1 className="text-xl font-bold text-[#1C1C1E]">계정 만들기</h1>
          <p className="text-sm text-gray-400">리마인더를 시작해 보세요</p>
        </div>

        <RegisterForm />

        <p className="text-sm text-gray-400">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-blue-500 font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

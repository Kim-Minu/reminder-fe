"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "../hooks/useAuth";

export default function RegisterForm() {
  const router = useRouter();
  const register = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setConfirmError("비밀번호가 일치하지 않습니다");
      return;
    }
    setConfirmError("");
    await register.mutateAsync({ name, email, password });
    router.replace("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="name">
          이름
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="홍길동"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="8자 이상"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor="confirm">
          비밀번호 확인
        </label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setConfirmError("");
          }}
          className={`px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
            confirmError ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="••••••••"
        />
        {confirmError && (
          <p className="text-xs text-red-500">{confirmError}</p>
        )}
      </div>

      {register.error && (
        <p className="text-sm text-red-500 text-center">
          {(register.error as { response?: { data?: { message?: string } } })
            .response?.data?.message ?? "계정 생성에 실패했습니다"}
        </p>
      )}

      <button
        type="submit"
        disabled={register.isPending}
        className="mt-2 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 active:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {register.isPending ? "생성 중..." : "계정 만들기"}
      </button>
    </form>
  );
}

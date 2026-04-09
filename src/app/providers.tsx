"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { setAuthToken } from "@/shared/lib/api";
import useAuthStore from "@/features/auth/store/authStore";

function AuthInitializer() {
  const accessToken = useAuthStore((s) => s.accessToken);

  console.log("AuthInitializer", accessToken);
  useEffect(() => {
    // 페이지 새로고침 후 persist 스토리지에서 복원된 토큰을 axios 헤더에 반영
    setAuthToken(accessToken);
  }, [accessToken]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      {children}
    </QueryClientProvider>
  );
}

@AGENTS.md

# 프로젝트 개발 관례

## 디렉토리 구조

```
src/
  app/          # Next.js App Router 진입점 (라우팅, metadata만)
  features/     # 도메인별 비즈니스 로직
  shared/       # 도메인 무관 공통 코드
```

`src/pages/` 같은 중간 레이어는 만들지 않는다. `app/` 페이지에서 `features/` 컴포넌트를 직접 사용한다.

## features 구조

각 feature는 `src/features/<domain>/` 아래에 다음 구조를 따른다:

```
features/<domain>/
  components/   # React 컴포넌트 ("use client" 명시)
  hooks/        # TanStack Query 훅 (useQuery, useMutation)
  services/     # axios API 호출 함수
  store/        # Zustand 스토어
  types/        # TypeScript 타입/인터페이스
  index.ts      # public API (외부에서는 index.ts를 통해서만 import)
```

현재 도메인: `auth`, `reminder`, `reminder-list`

## API 호출

- HTTP 클라이언트: `src/shared/lib/api.ts`의 axios 인스턴스만 사용
- 환경변수: `NEXT_PUBLIC_API_BASE_URL` (`.env.local`)
- Authorization 헤더: `setAuthToken(token)` 함수로 관리
  - 모듈 로드 시 localStorage에서 자동 복원
  - 로그인: `authStore`의 `setTokens` 호출 → `onRehydrateStorage`가 헤더 반영
  - 로그아웃: `setAuthToken(null)` 명시 호출
- 401/403 응답 시 인터셉터가 토큰 제거 후 `/login`으로 리다이렉트

## 상태 관리

- 서버 상태: TanStack Query (`useQuery`, `useMutation`)
- 클라이언트 전역 상태: Zustand
  - 인증 토큰: `authStore` (zustand `persist` 사용, localStorage key: `"auth"`)
  - UI 상태: 각 feature의 `uiStore` (persist 없음)
- Query key 컨벤션: 상수 함수로 정의 (예: `const remindersKey = (listId: number) => ["reminders", listId] as const`)

## 컴포넌트

- 클라이언트 컴포넌트는 파일 상단에 `"use client"` 명시
- `app/` 하위 page 컴포넌트는 Server Component로 유지 (metadata 설정 가능)
- 스타일링: Tailwind CSS

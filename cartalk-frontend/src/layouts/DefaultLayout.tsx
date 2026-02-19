
// src/layouts/DefaultLayout.tsx
// 로그인 전 (사이드바 없음)
import { Outlet } from "react-router-dom"

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* 사이드바 없는 레이아웃입니다.
         여기에 공통 헤더를 넣거나, 그냥 바로 Outlet을 렌더링합니다.
      */}
      <Outlet />
    </div>
  )
}
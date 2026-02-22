//로그인/회원가입 전용으로 씁니다.
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* 상단 바 없이 카드만 중앙에 띄우는 용도입니다. */}
      <Outlet />
    </div>
  );
}
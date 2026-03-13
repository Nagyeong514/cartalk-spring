import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      {/* 🚀 통합 상단 네비게이션 바 */}
      <Navbar />

      {/* 🚀 실제 페이지 내용 영역 */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
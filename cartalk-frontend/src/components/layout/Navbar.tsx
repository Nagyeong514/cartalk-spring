import { Link, useLocation } from "react-router-dom";
import { Shield, Car } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();

  // Active 상태에 따른 색상 결정 함수
  const getLinkStyle = (path: string) => {
    return pathname.startsWith(path)
      ? "text-white font-bold" // Active: 하얀색
      : "text-zinc-500 hover:text-zinc-300 transition-colors"; // Inactive: 그레이색
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#09090b]/95 backdrop-blur supports-[backdrop-filter]:bg-[#09090b]/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-6 lg:px-8">
        {/* 🚗 로고: 클릭 시 /community로 이동 */}
        <Link to="/community" className="mr-10 flex items-center gap-2 group">
          <div className="relative flex items-center justify-center">
            <Shield className="h-7 w-7 text-white fill-white/10 group-hover:scale-110 transition-transform" />
            <Car className="h-3 w-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">
            CarTalk Pro
          </span>
        </Link>

        {/* 🧭 메뉴: My Guardian & Community */}
        <nav className="flex items-center space-x-8 text-sm font-medium">
          <Link to="/guardian" className={getLinkStyle("/guardian")}>
            My Guardian
          </Link>
          <Link to="/community" className={getLinkStyle("/community")}>
            Community
          </Link>
        </nav>

        {/* 우측 사용자 아바타 (더미) */}
        <div className="ml-auto flex items-center">
          <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-400">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
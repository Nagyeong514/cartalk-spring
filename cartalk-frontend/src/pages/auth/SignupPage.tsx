// 4. 회원가입 창

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Lock, Car, Calendar,
  ChevronRight, ArrowLeft, ShieldCheck, Eye, EyeOff
} from "lucide-react";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // 회원가입 완료 후 가디언 페이지로 이동하는 함수
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 로직은 나중에 백엔드와 연결!
    navigate("/guardian");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 font-sans">
      {/* 1. 상단 로고 영역 */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
          <Car className="h-7 w-7 text-black" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">CarTalk Pro</h1>
      </div>

      {/* 2. 회원가입 카드 */}
      <div className="w-full max-w-md bg-[#121214] border border-white/5 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Create Account</h2>
          <p className="text-sm text-zinc-500">Start your smart car life today</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* 사용자 기본 정보 */}
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-[#1c1c1f] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                required
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#1c1c1f] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-[#1c1c1f] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="h-px bg-white/5 my-2" />

          {/* 🚗 핵심: 차량 정보 입력 섹션 */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 ml-1">Vehicle Info</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative group">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Model (ex. A6)"
                  className="w-full bg-[#1c1c1f] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-white/20"
                  required
                />
              </div>
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Year (ex. 2025)"
                  className="w-full bg-[#1c1c1f] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-white/20"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2"
          >
            Create Account <ChevronRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-zinc-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <Link to="/" className="mt-8 flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>
    </div>
  );
}
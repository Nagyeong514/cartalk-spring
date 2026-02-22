import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Lock, Car, Calendar,
  ChevronRight, ArrowLeft, ShieldCheck, Eye, EyeOff,
  Fingerprint
} from "lucide-react";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // 1. 입력 데이터를 상태(state)로 통합 관리
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    modelName: "",
    modelYear: "",
    vin: ""
  });

  // 2. 입력값이 변할 때 실행되는 핸들러 (동적 처리)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. 백엔드 서버로 회원가입 요청 전송
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 백엔드 DTO 규격에 맞춰 전송 (연도 데이터는 숫자로 변환)
      const response = await fetch("http://localhost:8080/api/member/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          modelYear: Number(formData.modelYear) // 문자열을 숫자로 변환하여 전송
        }),
      });

      if (response.ok) {
        alert("Welcome to CarTalk Pro! 🎉");
        navigate("/login"); // 가입 성공 시 로그인 페이지로 이동
      } else {
        const errorData = await response.json();
        alert(`Signup failed: ${errorData.message || 'Please check your information.'}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Cannot connect to server. Please check if the backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 font-sans">
      {/* 상단 로고 */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
          <Car className="h-7 w-7 text-black" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">CarTalk Pro</h1>
      </div>

      {/* 회원가입 카드 */}
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
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#1c1c1f] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                required
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1c1c1f] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
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

          {/* 차량 정보 입력 섹션 */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500 ml-1">Vehicle Info</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative group">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  name="modelName"
                  type="text"
                  placeholder="Model (ex. A6)"
                  value={formData.modelName}
                  onChange={handleChange}
                  className="w-full bg-[#1c1c1f] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-white/20"
                  required
                />
              </div>
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  name="modelYear"
                  type="text"
                  placeholder="Year (ex. 2025)"
                  value={formData.modelYear}
                  onChange={handleChange}
                  className="w-full bg-[#1c1c1f] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-white/20"
                  required
                />
              </div>
            </div>

            <div className="relative group">
              <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                name="vin"
                type="text"
                maxLength={17}
                placeholder="Vehicle Identification Number (17 chars)"
                value={formData.vin}
                onChange={handleChange}
                className="w-full bg-[#1c1c1f] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-white/20 placeholder:text-zinc-600"
                required
              />
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
            <Link to="/login" className="text-white font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {/* 하단 홈 버튼 살리기 */}
      <Link to="/" className="mt-8 flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>
    </div>
  );
}
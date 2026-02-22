// src/components/common/LoginForm.tsx

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
// 아래 경로들은 사용자의 폴더 구조에 맞춰 수정했습니다.
import { Button } from "./Button" // shadcn UI 파일들을 common 폴더에 넣을 경우
import { Input } from "./Input"
import { Label } from "./Label"
import { Separator } from "./Separator"

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.84 5.18 4.6 6.56-.16.56-.58 2.04-.66 2.36-.1.4.15.39.31.28.13-.08 2.04-1.38 2.86-1.94.6.08 1.22.14 1.89.14 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" fill="#3C1E1E" />
    </svg>
  )
}

// 로그인 백엔드 연결하는중
// ✅ 1. 부모(LoginPage)로부터 받을 '함수'의 타입을 정의해줍니다.
interface LoginFormProps {
  onSubmit: (data: any) => void;
}

// ✅ 2. props에서 onSubmit을 꺼내옵니다.
export function LoginForm({ onSubmit }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 3. 여기가 핵심! 부모가 준 함수에 우리가 입력한 데이터를 담아서 실행합니다.
    // 그러면 LoginPage에 있는 handleLoginSubmit이 이 데이터를 들고 백엔드로 날아갑니다.
    onSubmit({ email, password });
  }



  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-8">
      {/* Email Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 pl-10 bg-secondary border-border text-foreground"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm text-muted-foreground">Password</Label>
          <button type="button" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 pl-10 pr-10 bg-secondary border-border text-foreground"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="h-12 w-full text-sm font-semibold tracking-wide">Login</Button>

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">or continue with</span>
        <Separator className="flex-1" />
      </div>

      <div className="flex flex-col gap-3">
        <button type="button" className="flex items-center justify-center gap-3 h-12 w-full rounded-md border border-border bg-secondary hover:bg-accent">
          <GoogleIcon /> Continue with Google
        </button>
        <button type="button" className="flex items-center justify-center gap-3 h-12 w-full rounded-md" style={{ backgroundColor: "#FEE500", color: "#3C1E1E" }}>
          <KakaoIcon /> Continue with Kakao
        </button>
      </div>
    </form>
  )
}
// src/pages/auth/LoginPage.tsx

import { Car } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/common/Card"
import { LoginForm } from "../../components/common/LoginForm"

export default function LoginPage() {
    const navigate = useNavigate(); // [페이지 이동] 성공 시 다른 화면으로 보내기 위한 도구

      // [로그인 처리] 사용자가 ID/PW를 입력하고 제출했을 때 실행됨
      const handleLoginSubmit = async (data: any) => {
        try {
          const response = await fetch("http://localhost:8080/api/member/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            // ✅ 1. 백엔드가 준 '긴 문자열(토큰)'을 텍스트 형식으로 받습니다.
            const token = await response.text();

            // ✅ 2. 나중에 다른 API를 호출할 때 써야 하므로 브라우저 금고(LocalStorage)에 저장합니다.
            localStorage.setItem("accessToken", token);

            console.log("Login Success! Token stored."); // 토큰 저장 확인용 로그
            alert("Welcome back! 🏎️");
            navigate("/guardian"); // 가디언 페이지로 슝!
          } else {
            alert("Login failed. Please check your email or password.");
          }
        } catch (error) {
          console.error("Login error:", error);
          alert("Cannot connect to server.");
        }
      };

  return (
    /* 1. 여기에 'dark' 클래스를 추가하면 v0 디자인이 살아납니다! */
    <div className="dark">
      {/* 2. bg-background는 globals.css의 --background 색상을 따라갑니다. */}
      <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12 text-foreground">

        {/* Logo & Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            CarTalk Pro
          </h1>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-[420px] border-border bg-card shadow-2xl shadow-black/40">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-lg font-semibold text-foreground">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* [연결] 폼 제출 시 위 로그인 함수가 실행되도록 연결 */}
            <LoginForm onSubmit={handleLoginSubmit} />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          {"계정이 없으신가요? "}
          <Link
            to="/signup"
            className="text-foreground underline underline-offset-4 hover:text-foreground/80 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </main>
    </div>
  )
}
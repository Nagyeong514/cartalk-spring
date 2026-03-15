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
    const navigate = useNavigate();

    const handleLoginSubmit = async (data: any) => {
        try {
            const response = await fetch("http://localhost:8080/api/member/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                /*
                 * [수정] 백엔드 응답이 String(토큰)에서 LoginResponseDto(JSON)로 변경됨에 따라
                 * response.text() 대신 response.json()을 사용합니다.
                 */
                const result = await response.json();

                /*
                 * [저장] 본인 확인 및 사용자 식별을 위해 세 가지 정보를 금고(LocalStorage)에 저장합니다.
                 * 1. accessToken: API 권한 인증용
                 * 2. memberId: 수정/삭제 버튼 노출 시 고유 식별 비교용 (아이디어 B 적용)
                 * 3. userName: 화면 표시용
                 */
                localStorage.setItem("accessToken", result.accessToken);
                localStorage.setItem("memberId", String(result.memberId));
                localStorage.setItem("userName", result.name);

                console.log("Login Success! Member ID:", result.memberId);
                alert(`${result.name}님, 환영합니다! 🏎️`);

                // 가디언 페이지가 아닌 커뮤니티로 바로 가서 수정 버튼을 테스트해볼 수 있게 경로를 설정해도 좋습니다.
                navigate("/community");
            } else {
                alert("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("서버에 연결할 수 없습니다.");
        }
    };

    return (
        <div className="dark">
            <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                        <Car className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-foreground">
                        CarTalk Pro
                    </h1>
                </div>

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
                        <LoginForm onSubmit={handleLoginSubmit} />
                    </CardContent>
                </Card>

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
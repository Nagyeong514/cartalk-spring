// src/App.tsx 최종 정리본
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// 레이아웃 임포트 (파일이 실제로 src/layouts/ 안에 있어야 합니다!)
import DefaultLayout from "./layouts/DefaultLayout" // 상단 바 있는 레이아웃
import AuthLayout from "./layouts/AuthLayout"       // 상단 바 없는 레이아웃

// 페이지 임포트
import LandingPage from "./pages/home/LandingPage"
import LoginPage from "./pages/auth/LoginPage"
import SignUpPage from "./pages/auth/SignUpPage"
import PostList from "./pages/community/PostList"
import PostWrite from "./pages/community/PostWrite"
import PostEdit from "./pages/community/PostEdit"
import PostDetail from "./pages/community/PostDetail"
import GuardianPage from "./pages/mycar/GuardianPage"
import AdminDashboard from "./pages/admin/AdminDashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 대문 (로그인 전) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. 인증 (상단 바 없음) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        {/* 3. 서비스 본체 (통합 상단 바 적용) */}
        <Route element={<DefaultLayout />}>
          <Route path="/guardian" element={<GuardianPage />} />
          <Route path="/community" element={<PostList />} />
          <Route path="/community/write" element={<PostWrite />} />
          <Route path="/community/edit/:id" element={<PostEdit />} />
          <Route path="/community/:id" element={<PostDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* 4. 예외 처리: 이상한 주소는 커뮤니티로 */}
        <Route path="*" element={<Navigate to="/community" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
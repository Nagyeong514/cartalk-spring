// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import DefaultLayout from "./layouts/DefaultLayout"
import LoginPage from "./pages/auth/LoginPage"
import PostList from "./pages/community/PostList"
import PostWrite from "./pages/community/PostWrite"

// ✅ [수정 1] 가디언 페이지 임포트를 추가했습니다!
import GuardianPage from "./pages/mycar/GuardianPage"
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 */}
        <Route element={<DefaultLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* 커뮤니티 페이지들 */}
        <Route path="/community" element={<PostList />} />
        <Route path="/community/write" element={<PostWrite />} />

        {/* ✅ [수정 2] 가디언 페이지를 '별표(*)' 위로 올렸습니다! */}
        <Route path="/guardian" element={<GuardianPage />} />

        {/* ✅ [수정 3] 중복된 '/'를 정리하고 기본 페이지를 가디언으로 설정했습니다. */}
        <Route path="/" element={<Navigate to="/guardian" replace />} />

        {/* 마지막 수단: 지정되지 않은 모든 경로는 커뮤니티로 보냅니다. */}
        <Route path="*" element={<Navigate to="/community" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App

// src/App.tsx 예시
import { BrowserRouter, Routes, Route } from "react-router-dom"
import DefaultLayout from "./layouts/DefaultLayout"
import LoginPage from "./pages/auth/LoginPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 전용 레이아웃으로 감싸기 */}
        <Route element={<DefaultLayout />}>
          <Route path="/login" element={<LoginPage />} />
          {/* 여기에 회원가입 페이지 등도 추가 가능 */}
        </Route>

        {/* 로그인 후 전용 레이아웃 (나중에 만들 DashboardLayout) */}
        {/* <Route element={<DashboardLayout />}> ... </Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
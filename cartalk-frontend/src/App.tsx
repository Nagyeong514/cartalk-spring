import { useState } from 'react'
import './App.css'

type ViewType = 'login' | 'register' | 'forgot';

function App() {
  // 1. 상태 관리 (기존 currentView 변수 역할)
  const [view, setView] = useState<ViewType>('login');
  const [showPassword, setShowPassword] = useState(false);

  // 2. 뷰 설정 데이터 (기존 viewConfig 객체 역할)
  const config = {
    login: {
      title: '환영합니다! 다시 돌아오셨군요.',
      subtitle: '이메일과 비밀번호를 입력하고 카토크와 함께하세요.',
      divider: '또는 소셜 계정으로 로그인',
      footer: (
        <>아직 회원이 아니신가요? <button onClick={() => setView('register')} className="link-button">지금 바로 가입하세요.</button></>
      )
    },
    register: {
      title: '회원가입',
      subtitle: '새로운 계정을 만들고 카토크와 함께 시작하세요.',
      divider: '또는 소셜 계정으로 가입',
      footer: (
        <>이미 회원이신가요? <button onClick={() => setView('login')} className="link-button">로그인하기.</button></>
      )
    },
    forgot: {
      title: '비밀번호 재설정',
      subtitle: '이메일 주소를 입력하시면 재설정 링크를 보내드립니다.',
      divider: '',
      footer: (
        <>비밀번호가 기억나셨나요? <button onClick={() => setView('login')} className="link-button">로그인 페이지로 돌아가기.</button></>
      )
    }
  };

  return (
    <div className="container">
      {/* 왼쪽 패널 - 브랜드 정보 */}
      <div className="left-panel">
        <div className="brand-content">
          <div className="brand-header">
            <div className="logo"><div className="logo-icon"></div></div>
            <h1 className="brand-name">CarTalk</h1>
          </div>
          <div className="brand-message">
            <h2 className="brand-title">자동차의 모든 것, CarTalk 시작하세요.</h2>
            <p className="brand-subtitle">우리만의 자동차 이야기를 나누고, 정보를 공유하며, 소통하는 공간입니다.</p>
          </div>
          <div className="brand-footer">
            <span className="privacy-link">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* 오른쪽 패널 - 폼 영역 */}
      <div className="right-panel">
        {view === 'forgot' && (
          <button className="back-button" onClick={() => setView('login')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
          </button>
        )}

        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">{config[view].title}</h2>
            <p className="form-subtitle">{config[view].subtitle}</p>
          </div>

          {/* 로그인 폼 */}
          {view === 'login' && (
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">이메일</label>
                <input type="email" className="form-input" placeholder="user@company.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">비밀번호</label>
                <div className="password-input-container">
                  <input type={showPassword ? "text" : "password"} className="form-input" placeholder="비밀번호를 입력해 주세요" required />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>
              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" /> 로그인 정보 기억하기
                </label>
                <button type="button" className="link-button" onClick={() => setView('forgot')}>비밀번호를 잊으셨나요?</button>
              </div>
              <button type="submit" className="primary-button">로그인</button>
            </form>
          )}

          {/* 회원가입 폼 (간소화 예시) */}
          {view === 'register' && (
            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">성함</label>
                <input type="text" className="form-input" placeholder="홍길동" required />
              </div>
              <div className="form-group">
                <label className="form-label">이메일</label>
                <input type="email" className="form-input" placeholder="user@company.com" required />
              </div>
              <button type="submit" className="primary-button">회원가입</button>
            </form>
          )}

          {/* 소셜 로그인 섹션 */}
          {view !== 'forgot' && (
            <div className="social-section">
              <div className="divider">
                <span className="divider-text">{config[view].divider}</span>
              </div>
              <div className="social-buttons">
                <button className="social-button">Google</button>
                <button className="social-button">Apple</button>
              </div>
            </div>
          )}

          <div className="form-footer">
            <span className="footer-text">{config[view].footer}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
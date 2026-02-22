// 1. 로그인 전 메인화면

import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  Brain, Cloud, Shield, Zap, Github, Twitter, Linkedin,
  ArrowRight, ShieldCheck, Bell, MapPin, Droplets, Menu, X, Car
} from "lucide-react"

// --- 1. 통합용 내부 부품: Button (경로 에러 방지를 위해 내장형으로 제작) ---
const Button = ({ className = "", variant = "primary", size = "md", ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
  const variants: any = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20",
    outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  }
  const sizes: any = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  }
  return <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
}

// --- 2. Mouse Move Effect ---
function MouseMoveEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 80%)`,
      }}
    />
  )
}

// --- 3. Navbar ---
// --- 3. Navbar (로고와 스타일을 앱 내부와 통일했습니다) ---
function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#09090b]/95 backdrop-blur supports-[backdrop-filter]:bg-[#09090b]/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4">
        {/* 🚗 로고: 클릭 시 /community로 이동 (앱 내부와 동일한 로고 적용) */}
        <Link to="/community" className="mr-6 flex items-center gap-2 group">
          <div className="relative flex items-center justify-center">
            <Shield className="h-7 w-7 text-primary fill-primary/10 group-hover:scale-110 transition-transform" />
            <Car className="h-3.5 w-3.5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <span className="font-black text-xl tracking-tight text-foreground">
            CarTalk Pro
          </span>
        </Link>

        {/* 🧭 메뉴: My Guardian & Community */}
        <nav className="hidden md:flex flex-1 items-center space-x-8 text-sm font-bold">
          <Link to="/guardian" className="text-zinc-500 hover:text-white transition-colors">
            My Guardian
          </Link>
          <Link to="/community" className="text-zinc-500 hover:text-white transition-colors">
            Community
          </Link>
        </nav>

        {/* 🔑 버튼: 랜딩 페이지 전용 버튼 유지 */}
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="font-bold">Login</Button>
          </Link>
          <Link to="/signup"> {/* Get Started는 회원가입으로! */}
            <Button size="sm" className="font-bold">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

// --- 4. Hero Section ---
function Hero() {
  return (
    <section className="container mx-auto flex min-h-[calc(100vh-4rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32 px-4">
      <div className="space-y-6">
        <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl">
          Drive Smarter with
          <br />
          <span className="text-primary">CarTalk Pro</span>
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 font-medium">
          실시간 자동차 리콜 모니터링부터 공공데이터 기반 세차 지수까지.
          <br />당신의 소중한 차를 위한 가장 완벽한 AI 가디언을 만나보세요.
        </p>
      </div>
      <div className="flex gap-4">
        <Link to="/guardian">
          <Button size="lg" className="font-bold">
            Explore Guardian <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link to="/community">
          <Button variant="outline" size="lg" className="font-bold">Join Community</Button>
        </Link>
      </div>
    </section>
  )
}

// --- 5. Features Section ---
function Features() {
  const features = [
    {
      name: "Real-time Recall Monitoring",
      description: "국토교통부 API와 연동하여 내 차량의 리콜 정보를 실시간으로 감시합니다.",
      icon: ShieldCheck,
    },
    {
      name: "Smart Maintenance Alerts",
      description: "주행 거리와 정비 주기를 분석하여 Google Calendar와 Gmail로 알림을 보냅니다.",
      icon: Bell,
    },
    {
      name: "Nearby Repair Finder",
      description: "내 주변의 정비소 위치와 리콜 수리 가능 여부를 즉시 확인하세요.",
      icon: MapPin,
    },
    {
      name: "Smart Car Wash Index",
      description: "기상청 날씨 데이터를 기반으로 오늘 세차하기 딱 좋은 시간을 알려드립니다.",
      icon: Droplets,
    },
  ]

  return (
    <section className="container mx-auto space-y-16 py-24 md:py-32 px-4">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-black text-3xl leading-[1.1] sm:text-4xl md:text-5xl">Automotive Intelligence</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg font-medium">
          CarTalk Pro는 당신의 카 라이프를 더 안전하고 편리하게 바꿉니다.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="font-black text-xl">{feature.name}</h3>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// --- 6. CTA Section ---
function CTA() {
  return (
    <section className="border-t border-border/40 bg-secondary/30">
      <div className="container mx-auto flex flex-col items-center gap-6 py-24 text-center md:py-32 px-4">
        <h2 className="font-black text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
          Ready to protect your car?
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 font-medium">
          지금 바로 차대번호를 등록하고 리콜 감시 서비스를 시작하세요.
        </p>
        <Link to="/login" className="mt-4">
          <Button size="lg" className="font-bold px-12">Get Started Free</Button>
        </Link>
      </div>
    </section>
  )
}

// --- 7. Footer ---
function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container mx-auto flex flex-col gap-12 py-12 md:flex-row md:py-16 px-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="font-black text-xl">CarTalk Pro</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs font-medium">자동차 관리 자동화 엔진 & 커뮤니티 플랫폼.</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-12 sm:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Services</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/guardian" className="text-muted-foreground hover:text-primary">Recall Alert</Link></li>
              <li><Link to="/community" className="text-muted-foreground hover:text-primary">Community</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Connect</h3>
            <div className="flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto border-t border-border/40 py-8 px-4">
        <p className="text-center text-xs text-muted-foreground font-medium">
          © {new Date().getFullYear()} CarTalk Pro, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

// --- 8. Main Landing Page Component ---
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground dark">
      <MouseMoveEffect />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
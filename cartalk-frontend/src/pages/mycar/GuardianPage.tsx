import { useState, useEffect, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield, ChevronLeft, Gauge, AlertTriangle, Droplets, Wrench,
  FileText, Camera, ClipboardCheck, ShieldAlert, X, Star,
  CalendarPlus, Mail, Phone, MapPin, Sun, Cloud, Send, ArrowLeft, ImagePlus, Upload, ChevronDown, Hash, Type, AlignLeft
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────
export type TabKey = "summary" | "photos" | "evaluation" | "guardian" | "repair" | "carwash";

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

// ─── Sub-Components ─────────────────────────────────────────────────────────────

/* 1. Stat Card Component */
function StatCard({ icon, label, value, sub, accent = "text-primary" }: { icon: React.ReactNode; label: string; value: string; sub: string; accent?: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-center gap-2">
        <div className={`${accent}`}>{icon}</div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

/* 2. Car Hero Section (사진 크기 대폭 확대!) */
function CarHero({ shrink }: { shrink: boolean }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 ease-in-out ${
        shrink ? "lg:col-span-1" : "lg:col-span-2"
      }`}
      // ✅ minHeight를 늘려서 초기 영역을 확보합니다.
      style={{ minHeight: shrink ? 400 : 600 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      <div className="relative z-10 flex w-full flex-col items-center gap-6 p-8">
        <img
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200" // 더 큰 이미지 요청
          alt="2024 BMW 5 Series"
          // ✅ 초기(shrink=false) 높이를 max-h-[500px]로 키우고 w-full로 꽉 채웁니다.
          // 패널이 열렸을 때도 max-h-80으로 기존보다 더 크게 유지합니다.
          className={`object-contain transition-all duration-500 w-full ${shrink ? "max-h-80" : "max-h-[500px]"}`}
        />
        <div className="flex flex-col items-center gap-2 text-center">
          {/* 폰트 크기도 조금 더 키워 존재감을 높였습니다. */}
          <h2 className="text-3xl font-black tracking-tight text-foreground">BMW 5 Series</h2>
          <p className="text-base text-muted-foreground">2024 Sedan</p>
          <div className="mt-2 flex items-center gap-4">
            <span className="rounded-md bg-primary/10 px-4 py-1.5 text-lg font-bold text-primary">$58,900</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`h-4 w-4 ${i <= 4 ? "fill-accent text-accent" : "text-muted-foreground"}`} />
              ))}
              <span className="ml-1 text-sm text-muted-foreground">4.7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3. Detail Panels (Side Panels) */
function GuardianPanel() {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold text-foreground">Guardian - Recall Status</h3>
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-destructive" />
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold text-destructive">Engine Defect Alert</p>
            <p className="text-base text-muted-foreground leading-relaxed">NHTSA Recall #24V-892: Potential turbocharger oil leak may cause engine stalling. Please contact your nearest dealer immediately.</p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Issued: Jan 12, 2026 &middot; Priority: <span className="text-destructive">High</span></p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
          <CalendarPlus className="h-5 w-5" /> Add to Google Calendar
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-card px-6 py-4 text-base font-bold text-foreground hover:border-primary/50 hover:bg-accent/50 transition-all">
          <Mail className="h-5 w-5" /> Send Gmail Report
        </button>
      </div>
    </div>
  );
}

function RepairShopsPanel() {
  const shops = [
    { name: "BMW of Springfield", distance: "2.4 mi", phone: "(555) 123-4567", rating: "4.8" },
    { name: "Elite Auto Service", distance: "3.1 mi", phone: "(555) 234-5678", rating: "4.6" },
    { name: "Precision Motors", distance: "5.2 mi", phone: "(555) 987-6543", rating: "4.7" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold text-foreground">Nearby Repair Shops</h3>
      <p className="text-muted-foreground">Based on your current location (Busan, South Korea).</p>
      <div className="flex flex-col gap-4">
        {shops.map((shop) => (
          <div key={shop.name} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-bold text-foreground">{shop.name}</p>
                <p className="text-sm text-muted-foreground">{shop.distance} away</p>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-accent/10 px-3 py-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-bold text-accent">{shop.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href={`tel:${shop.phone}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border bg-card py-3 text-sm font-bold hover:border-primary/50 hover:text-primary transition-all">
                <Phone className="h-4 w-4" /> Call Shop
              </a>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
                <MapPin className="h-4 w-4" /> View on Map
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarWashPanel() {
  const score = 85; // 점수 상향 조정
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold text-foreground">Car Wash Index</h3>
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8">
        <div className="relative flex h-48 w-48 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${(score / 100) * 326.7} 326.7`} strokeLinecap="round" className="text-emerald-500 transition-all duration-1000" />
          </svg>
          <div className="flex flex-col items-center">
            <Droplets className="h-8 w-8 text-emerald-500" />
            <p className="text-5xl font-black text-foreground mt-2">{score}</p>
            <p className="text-sm font-bold text-emerald-500">Excellent</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-lg font-medium text-muted-foreground bg-secondary/50 px-6 py-3 rounded-full">
          <Sun className="h-6 w-6 text-amber-500" /> <span>Sunny, 75°F</span>
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
        <p className="text-lg font-bold text-emerald-500 mb-2">Perfect Day for a Wash!</p>
        <p className="text-muted-foreground leading-relaxed">Clear skies and low humidity continue for the next 48 hours. It's the best time for detailing and waxing.</p>
      </div>
    </div>
  );
}

/* 4. Slide Panel Orchestrator (패널 너비 확대!) */
function SlidePanel({ activeTab, onClose }: { activeTab: TabKey | null; onClose: () => void }) {
  const isOpen = activeTab !== null;
  const panelTitles: Record<TabKey, string> = { summary: "Summary", photos: "Photos", evaluation: "Evaluation", guardian: "Guardian Alerts", repair: "Repair Shops", carwash: "Car Wash Index" };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      {/* ✅ lg:w-auto 대신 w-full로 설정하여 부모 Grid의 비율을 따르게 합니다. */}
      <aside className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l-2 border-border bg-card transition-transform duration-500 ease-in-out lg:static lg:z-auto lg:h-auto lg:rounded-2xl lg:border-2 shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full lg:hidden"}`}>
        {activeTab && (
          <>
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground">{panelTitles[activeTab]}</h3>
              <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              {activeTab === "guardian" && <GuardianPanel />}
              {activeTab === "repair" && <RepairShopsPanel />}
              {activeTab === "carwash" && <CarWashPanel />}
              {/* 다른 탭 내용도 여기에 추가... */}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────────────
export default function GuardianPage() {
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const tabs: Tab[] = [
    { key: "summary", label: "Summary", icon: <FileText className="h-4 w-4" /> },
    { key: "photos", label: "Photos", icon: <Camera className="h-4 w-4" /> },
    { key: "evaluation", label: "Evaluation", icon: <ClipboardCheck className="h-4 w-4" /> },
    { key: "guardian", label: "Guardian", icon: <ShieldAlert className="h-4 w-4" /> },
    { key: "repair", label: "Repair", icon: <Wrench className="h-4 w-4" /> },
    { key: "carwash", label: "Car Wash", icon: <Droplets className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground dark">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-black tracking-tight text-foreground">CarTalk Pro</span>
          </div>
        </div>
        <div className="flex h-9 w-9 rounded-full bg-primary/20 ring-2 ring-primary/40" />
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<Gauge className="h-5 w-5" />} label="Mileage" value="34,218 mi" sub="Updated today" />
          <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Recall Alerts" value="1 Active" sub="Engine defect" accent="text-destructive" />
          <StatCard icon={<Droplets className="h-5 w-5" />} label="Car Wash Index" value="85/100" sub="Perfect day!" accent="text-emerald-500" />
          <StatCard icon={<Wrench className="h-5 w-5" />} label="Maintenance" value="D-15" sub="Oil change due" accent="text-amber-500" />
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(isActive ? null : tab.key)} className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${isActive ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ✅ 핵심 변경! Grid 비율을 [1fr_3fr] (25% : 75%)로 설정 */}
        <div className={`grid flex-1 gap-6 transition-all duration-500 ${activeTab !== null ? "lg:grid-cols-[1fr_3fr]" : "lg:grid-cols-1"}`}>
          <CarHero shrink={activeTab !== null} />
          <SlidePanel activeTab={activeTab} onClose={() => setActiveTab(null)} />
        </div>
      </main>
    </div>
  );
}
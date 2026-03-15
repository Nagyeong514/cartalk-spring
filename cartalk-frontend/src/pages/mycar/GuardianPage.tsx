import { useState, useEffect } from "react";
import {
  Gauge, AlertTriangle, Droplets, Wrench, FileText, Camera, ClipboardCheck,
  ShieldAlert, X, Star, CalendarPlus, Mail, Phone, MapPin, Sun, Info
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────
export type TabKey = "summary" | "photos" | "evaluation" | "guardian" | "repair" | "carwash";

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

// 백엔드 RecallResponseDto.RecallData와 매칭
interface RecallData {
  manufacturer: string;
  modelName: string;
  recallReason: string;
  productionStartDate: string;
  productionEndDate: string;
  recallStartDate: string;
}

// ─── Sub-Components ─────────────────────────────────────────────────────────────

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

function CarHero({ shrink, carData }: { shrink: boolean; carData: any }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 ease-in-out ${
        shrink ? "lg:col-span-1" : "lg:col-span-2"
      }`}
      style={{ minHeight: shrink ? 400 : 600 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      <div className="relative z-10 flex w-full flex-col items-center gap-6 p-8">
        <img
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200"
          alt="My Vehicle"
          className={`object-contain transition-all duration-500 w-full ${shrink ? "max-h-80" : "max-h-[500px]"}`}
        />
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-black tracking-tight text-foreground">{carData?.modelName || "My Car"}</h2>
          <p className="text-base text-muted-foreground">{carData?.modelYear || "2025"} Model</p>
          <div className="mt-2 flex flex-col items-center gap-3">
            <span className="rounded-full bg-secondary px-4 py-1 text-[10px] font-mono text-zinc-500">
              VIN: {carData?.vin || "-----------"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ✅ 3. GuardianPanel (수정된 섹션: 상세정보 + 위기 레드 + 큰 글씨) */
function GuardianPanel({ recalls }: { recalls: RecallData[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-bold text-foreground underline underline-offset-8 decoration-red-500/50">Guardian - Recall Status</h3>

      {recalls.length > 0 ? (
        recalls.map((recall, index) => (
          <div key={index} className="rounded-2xl border-2 border-red-600 bg-red-600/10 p-6 shadow-[0_0_20px_rgba(220,38,38,0.2)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-6">
              {/* 헤더 섹션 */}
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-10 w-10 text-red-500 animate-pulse" />
                <div>
                  <p className="text-xs font-black text-red-500 uppercase tracking-widest">Urgent Recall</p>
                  <p className="text-xl font-bold text-foreground">{recall.manufacturer} 공식 통보</p>
                </div>
              </div>

              {/* ✅ 사유 섹션 (나경님 요청: 더 크고 하얗게!) */}
              <div className="rounded-xl bg-zinc-950/60 p-5 border border-red-500/30">
                <div className="mb-3 flex items-center gap-2 text-red-400">
                  <Info size={18} />
                  <span className="text-sm font-black uppercase">결함 사유</span>
                </div>
                <p className="text-xl font-bold leading-snug text-white">
                  {recall.recallReason}
                </p>
              </div>

              {/* ✅ 상세 데이터 그리드 */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-zinc-900/50 p-3 border border-white/5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">대상 차명</p>
                  <p className="font-semibold text-foreground text-base">{recall.modelName}</p>
                </div>
                <div className="rounded-lg bg-zinc-900/50 p-3 border border-white/5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">리콜 개시일</p>
                  <p className="font-semibold text-red-400 text-base">{recall.recallStartDate}</p>
                </div>
                <div className="col-span-2 rounded-lg bg-zinc-900/50 p-3 border border-white/5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">대상 차량 생산 기간</p>
                  <p className="font-semibold text-foreground">
                    {recall.productionStartDate} ~ {recall.productionEndDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <span className="rounded bg-red-600 px-3 py-1 text-xs font-black text-white shadow-lg">HIGH PRIORITY</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-12 text-center transition-all hover:border-emerald-500/40">
          <ShieldAlert className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
          <p className="text-xl font-bold text-emerald-500">차량이 안전합니다</p>
          <p className="text-muted-foreground mt-2">현재 감지된 리콜 데이터가 없습니다.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-4 text-base font-black text-white transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30">
          <CalendarPlus size={20} /> 구글 캘린더 예약
        </button>
        <button className="flex items-center justify-center gap-2 rounded-xl border-2 border-zinc-700 bg-card py-4 text-base font-black text-foreground transition-all hover:border-red-500 hover:bg-zinc-800">
          <Mail size={20} /> 리포트 메일 발송
        </button>
      </div>
    </div>
  );
}

/* ⚠️ 건드리지 말라고 하신 RepairShopsPanel */
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

/* ⚠️ 건드리지 말라고 하신 CarWashPanel */
function CarWashPanel() {
  const score = 85;
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
            <p className="text-5xl font-black text-foreground mt-2">{score}</p>
            <p className="text-sm font-bold text-emerald-500">Excellent</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-lg font-medium text-muted-foreground bg-secondary/50 px-6 py-3 rounded-full">
          <Sun className="h-6 w-6 text-amber-500" /> <span>Sunny, 75°F</span>
        </div>
      </div>
    </div>
  );
}

/* 4. Slide Panel Orchestrator */
function SlidePanel({ activeTab, onClose, recalls }: { activeTab: TabKey | null; onClose: () => void; recalls: RecallData[] }) {
  const isOpen = activeTab !== null;
  const panelTitles: Record<TabKey, string> = { summary: "Summary", photos: "Photos", evaluation: "Evaluation", guardian: "Guardian Alerts", repair: "Repair Shops", carwash: "Car Wash Index" };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l-2 border-border bg-card transition-transform duration-500 ease-in-out lg:static lg:z-auto lg:h-auto lg:rounded-2xl lg:border-2 shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full lg:hidden"}`}>
        {activeTab && (
          <>
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground">{panelTitles[activeTab]}</h3>
              <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              {activeTab === "guardian" && <GuardianPanel recalls={recalls} />}
              {activeTab === "repair" && <RepairShopsPanel />}
              {activeTab === "carwash" && <CarWashPanel />}
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
  const [carData, setCarData] = useState<any>(null);
  const [recalls, setRecalls] = useState<RecallData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        setLoading(true);
        // 1. 내 차 정보 가져오기
        const carRes = await fetch("http://localhost:8080/api/vehicle/my", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (carRes.ok) {
          const car = await carRes.json();
          setCarData(car);

          // 2. 리콜 정보 가져오기
          const recallRes = await fetch(`http://localhost:8080/api/recall/check?carName=${car.modelName}&modelYear=${car.modelYear}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (recallRes.ok) {
            const recallList = await recallRes.json();
            setRecalls(recallList);
          }
        }
      } catch (error) {
        console.error("차량 정보 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const tabs: Tab[] = [
    { key: "summary", label: "Summary", icon: <FileText size={16} /> },
    { key: "photos", label: "Photos", icon: <Camera size={16} /> },
    { key: "evaluation", label: "Evaluation", icon: <ClipboardCheck size={16} /> },
    { key: "guardian", label: "Guardian", icon: <ShieldAlert size={16} /> },
    { key: "repair", label: "Repair", icon: <Wrench size={16} /> },
    { key: "carwash", label: "Car Wash", icon: <Droplets size={16} /> },
  ];

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black animate-pulse uppercase tracking-[0.3em]">CarTalk Pro : Securing...</div>;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground dark">
      <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<Gauge size={20} />} label="Mileage" value={`${carData?.mileage?.toLocaleString() || "0"} km`} sub="Real-time Sync" />
          <StatCard
            icon={<AlertTriangle size={20} className={recalls.length > 0 ? "animate-bounce" : ""} />}
            label="Recall Alerts"
            value={recalls.length > 0 ? `${recalls.length} Active` : "Safe"}
            sub={recalls.length > 0 ? "ACTION REQUIRED" : "Systems Normal"}
            accent={recalls.length > 0 ? "text-red-500" : "text-emerald-500"}
          />
          <StatCard icon={<Droplets size={20} />} label="Car Wash Index" value="85/100" sub="Perfect day!" accent="text-emerald-500" />
          <StatCard icon={<Wrench size={20} />} label="Maintenance" value="D-15" sub="Oil change due" accent="text-amber-500" />
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-inner">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(isActive ? null : tab.key)} className={`flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${isActive ? "bg-primary text-primary-foreground shadow-md scale-105" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={`grid flex-1 gap-6 transition-all duration-500 ${activeTab !== null ? "lg:grid-cols-[1fr_2.5fr]" : "lg:grid-cols-1"}`}>
          <CarHero shrink={activeTab !== null} carData={carData} />
          <SlidePanel activeTab={activeTab} onClose={() => setActiveTab(null)} recalls={recalls} />
        </div>
      </main>
    </div>
  );
}
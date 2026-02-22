import { useParams, useNavigate } from "react-router-dom";
import {
  MessageCircle, Heart, Share2, MoreVertical,
  Send, X, User, Car
} from "lucide-react";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/community");
  };

  return (
    // 1. 전체 배경: 더 짙은 오버레이와 강력한 블러 (backdrop-blur-xl)
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl transition-all animate-in fade-in duration-500">

      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* 2. 메인 카드: 스크롤바 디자인 커스텀 추가 */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#121214] border border-white/10 rounded-[2.5rem] shadow-[0_0_60px_-15px_rgba(0,0,0,1)]
        /* 다크 스크롤바 커스텀 */
        scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">

        {/* 🚀 [변경 1] X 버튼 위치 수정: 컨텐츠와 겹치지 않게 우측 상단 고정 및 여백 확보 */}
        <div className="sticky top-0 z-20 flex justify-end p-6 pointer-events-none">
          <button
            onClick={handleClose}
            className="pointer-events-auto p-3 bg-zinc-900/80 hover:bg-zinc-800 border border-white/5 rounded-full text-zinc-400 hover:text-white transition-all shadow-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 sm:px-10 pb-10 -mt-16 space-y-8">
          {/* 작성자 정보 헤더 */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary/40 to-primary/10 border border-white/5 flex items-center justify-center text-primary font-bold">
              <User className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg text-white">Car Lover #42</p>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>2 hours ago</span>
                <span className="h-1 w-1 bg-zinc-700 rounded-full" />
                <span className="flex items-center gap-1 text-primary/80"><Car className="h-3 w-3" /> BMW 5 Series</span>
              </div>
            </div>

          </div>

          {/* 본문 콘텐츠 */}
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight text-balance">
              BMW 5시리즈 리콜 수리 후기입니다 🛹🔥
            </h1>
            <p className="text-zinc-400 leading-relaxed text-lg font-medium">
              오늘 강남 서비스센터 다녀왔습니다. 가디언 알림 덕분에 빠르게 예약하고 다녀왔네요!
              냉각수 펌프 교체 받았고, 총 소요 시간은 1시간 정도 걸렸습니다. 직원분들도 친절하시고...
            </p>
          </div>

          {/* 메인 이미지 */}
          <div className="relative group overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000"
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="BMW 5 Series Repair"
            />
          </div>

          {/* 리액션 영역 */}
          <div className="flex items-center gap-6 py-2">
            <button className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500/20 transition-all">
              <Heart className="h-5 w-5 fill-rose-500" /> 24
            </button>
            <button className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 text-zinc-400 font-bold hover:bg-white/10 hover:text-white transition-all">
              <MessageCircle className="h-5 w-5" /> 12
            </button>
            <button className="ml-auto p-2 text-zinc-500 hover:text-white transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* 댓글 섹션 */}
          <section className="pt-8 border-t border-white/5 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              DISCUSSION <span className="h-1 w-1 bg-primary rounded-full" /> <span className="text-primary">12</span>
            </h2>

            <div className="relative group">
              <input
                type="text"
                placeholder="Share your thoughts..."
                className="w-full bg-[#09090b] border border-white/10 rounded-2xl py-5 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm text-white placeholder:text-zinc-600 shadow-inner"
              />
              {/* 🚀 [변경 3] 전송 버튼 밝기 및 명도 조절: 가독성 대폭 향상 */}
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary hover:bg-white text-black font-bold rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)] active:scale-95 group-hover:scale-105">
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                  <div className="h-8 w-8 rounded-full bg-zinc-800 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-300">CarGuy_{i}</p>
                    <p className="text-sm text-zinc-500 leading-relaxed">상세한 후기 감사합니다! 저도 리콜 대상인지 확인해봐야겠네요. 👍</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 🚀 [변경 4] 어두운 스크롤바를 위한 전역 스타일 주입 */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
          border: 2px solid #121214;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}
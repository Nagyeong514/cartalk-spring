import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MessageCircle, Heart, Share2, MoreVertical,
  Send, X, User, Car
} from "lucide-react";

// ✅ 진짜 서버 데이터를 가져올 API 트럭 임포트 (경로 주의!)
import { getPostDetail, PostDetailResponse, CommentDto } from "../../api/community";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>(); // URL에서 ID 추출
  const navigate = useNavigate();

  // ✅ 진짜 데이터를 담을 바구니 상태
  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState(""); // 댓글 입력 상태

  const handleClose = () => {
    navigate("/community");
  };

  // 🚚 컴포넌트가 켜지면 서버에서 상세 정보를 싣고 옵니다.
  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const data = await getPostDetail(Number(id));
        setPost(data);
      } catch (error) {
        console.error("상세 정보 로드 실패:", error);
        alert("존재하지 않거나 삭제된 게시글입니다.");
        handleClose();
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // 로딩 중이거나 데이터가 없을 때의 처리
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl text-white font-medium">
        트럭이 데이터를 싣고 오는 중... 🐘
      </div>
    );
  }

  if (!post) return null;

  return (
    // 1. 전체 배경: 디자인 유지
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl transition-all animate-in fade-in duration-500 font-sans text-white">

      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* 2. 메인 카드: 디자인 및 다크 스크롤바 유지 */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#121214] border border-white/10 rounded-[2.5rem] shadow-[0_0_60px_-15px_rgba(0,0,0,1)]
        /* 다크 스크롤바 커스텀 클래스 적용 */
        custom-scrollbar">

        {/* 🚀 X 버튼 위치 및 디자인 유지 */}
        <div className="sticky top-0 z-20 flex justify-end p-6 pointer-events-none">
          <button
            onClick={handleClose}
            className="pointer-events-auto p-3 bg-zinc-900/80 hover:bg-zinc-800 border border-white/5 rounded-full text-zinc-400 hover:text-white transition-all shadow-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 sm:px-10 pb-10 -mt-16 space-y-8">
          {/* ✅ 작성자 정보 헤더: 진짜 데이터 매핑 */}
          <div className="flex items-center gap-4">
            {/* 아바타: 이름 첫 글자 활용 */}
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary/40 to-primary/10 border border-white/5 flex items-center justify-center text-primary font-bold text-xl">
              {post.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg text-white">{post.authorName}</p>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                {/* ✅ 백엔드 TimeUtils의 "n시간 전" 적용 */}
                <span>{post.createdAt}</span>
                <span className="h-1 w-1 bg-zinc-700 rounded-full" />
                {/* ✅ 백엔드 carTag 적용 (없으면 CarTalk로 표시) */}
                <span className="flex items-center gap-1 text-primary/80"><Car className="h-3 w-3" /> {post.carTag || "CarTalk"}</span>
              </div>
            </div>
          </div>

          {/* ✅ 본문 콘텐츠: 진짜 데이터 매핑 */}
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight text-balance">
              {post.title}
            </h1>
            <p className="text-zinc-400 leading-relaxed text-lg font-medium whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* ✅ 메인 이미지 영역: 진짜 데이터 매핑 */}
          {post.images.length > 0 && (
            <div className="relative group overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
              <img
                // ✅ 첫 번째 이미지를 대표 이미지로 표시합니다. (경로 주의!)
                src={`http://localhost:8080${post.images[0].imageUrl}`}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={post.title}
              />
            </div>
          )}

          {/* ✅ 리액션 영역: 진짜 카운트 매핑 */}
          <div className="flex items-center gap-6 py-2">
            <button className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500/20 transition-all">
              <Heart className={`h-5 w-5 ${post.likesCount > 0 ? 'fill-rose-500' : ''}`} /> {post.likesCount.toLocaleString()}
            </button>
            <button className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 text-zinc-400 font-bold hover:bg-white/10 hover:text-white transition-all">
              <MessageCircle className="h-5 w-5" /> {post.commentCount.toLocaleString()}
            </button>
            <button className="ml-auto p-2 text-zinc-500 hover:text-white transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          {/* ✅ 댓글 섹션: 진짜 데이터 매핑 */}
          <section className="pt-8 border-t border-white/5 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              DISCUSSION <span className="h-1 w-1 bg-primary rounded-full" /> <span className="text-primary">{post.commentCount.toLocaleString()}</span>
            </h2>

            {/* 댓글 입력 영역 */}
            <div className="relative group">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-[#09090b] border border-white/10 rounded-2xl py-5 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm text-white placeholder:text-zinc-600 shadow-inner"
              />
              {/* 🚀 전송 버튼 디자인 유지 */}
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary hover:bg-white text-black font-bold rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)] active:scale-95 group-hover:scale-105 disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </div>

            {/* ✅ 진짜 댓글 리스트 루프 */}
            <div className="space-y-4">
              {post.comments.length > 0 ? post.comments.map((comment: CommentDto) => (
                <div key={comment.id} className="flex gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                  {/* 댓글 아바타 */}
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 shrink-0 flex items-center justify-center text-zinc-400 font-bold text-xs border border-white/5">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-zinc-300">{comment.authorName}</p>
                      {/* ✅ 댓글 작성 시간 추가 (필요시 백엔드 DTO 수정) */}
                      {/* <span className="text-xs text-zinc-600">{comment.createdAt}</span> */}
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-zinc-600 text-sm">아직 댓글이 없습니다. 첫 댓글의 주인공이 되어보세요! 😊</div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* 🚀 [변경 4] 어두운 스크롤바 스타일 유지 */}
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
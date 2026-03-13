import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageCircle, Heart, Share2, Send, X, Car, User } from "lucide-react";

// ✅ addLike, createComment 추가 임포트
import { getPostDetail, PostDetailResponse, CommentDto, addLike, createComment } from "../../api/community";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isLiking, setIsLiking] = useState(false); // 좋아요 중복 클릭 방지

  const handleClose = () => navigate("/community");

  const fetchDetail = async () => {
    if (!id) return;
    try {
      const data = await getPostDetail(Number(id));
      setPost(data);
    } catch (error) {
      console.error("상세 정보 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [id]);

  // ❤️ 좋아요 클릭 핸들러
  const handleLike = async () => {
    if (!post || isLiking) return;
    setIsLiking(true);
    try {
      const updatedLikes = await addLike(post.id);
      setPost({ ...post, likesCount: updatedLikes }); // 화면에 바로 반영
    } catch (error) {
      alert("로그인이 필요하거나 좋아요 처리에 실패했습니다.");
    } finally {
      setIsLiking(false);
    }
  };

  // 💬 댓글 전송 핸들러
  const handleCommentSubmit = async () => {
    if (!post || !newComment.trim()) return;
    try {
      await createComment(post.id, newComment);
      setNewComment(""); // 입력창 비우기
      fetchDetail(); // 댓글 목록 새로고침
    } catch (error) {
      alert("댓글 등록 실패!");
    }
  };

  if (isLoading) return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 text-white">트럭이 오는 중... 🐘</div>;
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl transition-all font-sans text-white">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#121214] border border-white/10 rounded-[2.5rem] shadow-2xl custom-scrollbar">

        <div className="sticky top-0 z-20 flex justify-end p-6 pointer-events-none">
          <button onClick={handleClose} className="pointer-events-auto p-3 bg-zinc-900/80 rounded-full text-zinc-400 hover:text-white transition-all"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-8 sm:px-10 pb-10 -mt-16 space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{post.authorName?.charAt(0).toUpperCase()}</div>
            <div className="flex-1">
              <p className="font-bold">{post.authorName}</p>
              <p className="text-xs text-zinc-500">{post.createdAt} • {post.carTag || "CarTalk"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-black">{post.title}</h1>
            <p className="text-zinc-400 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* ✅ 이미지 출력 (경로 최적화) */}
          {post.images?.length > 0 && (
            <div className="rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <img
                // 서버 주소와 이미지 경로가 잘 합쳐지는지 확인!
                src={`http://localhost:8080${post.images[0].imageUrl}`}
                className="w-full object-cover"
                alt="post"
                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x400?text=Image+Load+Failed"; }}
              />
            </div>
          )}

          <div className="flex items-center gap-6">
            <button onClick={handleLike} disabled={isLiking} className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500/20">
              <Heart className={`h-5 w-5 ${post.likesCount > 0 ? 'fill-rose-500' : ''}`} /> {post.likesCount}
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-zinc-400 font-bold">
              <MessageCircle className="h-5 w-5" /> {post.commentCount}
            </div>
          </div>

          <section className="pt-8 border-t border-white/5 space-y-6">
            <div className="relative">
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()} placeholder="Share your thoughts..." className="w-full bg-[#09090b] border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-white" />
              <button onClick={handleCommentSubmit} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary rounded-xl text-black"><Send className="h-4 w-4" /></button>
            </div>

            <div className="space-y-4">
              {post.comments?.length > 0 ? post.comments.map((comment: CommentDto) => (
                <div key={comment.id} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">{comment.authorName?.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-zinc-300">{comment.authorName}</p>
                    <p className="text-sm text-zinc-500">{comment.content}</p>
                  </div>
                </div>
              )) : <p className="text-center py-10 text-zinc-600">아직 댓글이 없어요!</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
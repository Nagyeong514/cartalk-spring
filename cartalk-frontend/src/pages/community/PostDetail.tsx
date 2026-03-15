import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageCircle, Heart, Send, X, Edit3, Trash2 } from "lucide-react";

// addLike, createComment 추가 임포트
import {
  getPostDetail,
  PostDetailResponse,
  CommentDto,
  addLike,
  createComment,
  deletePost
} from "../../api/community";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetailResponse | null>(null);

  /* * [수정] 이름표 대신 고유 번호(ID)를 가져옵니다.
   * LoginPage에서 저장한 'memberId'를 꺼냅니다.
   */
  const currentMemberId = localStorage.getItem("memberId");

  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isLiking, setIsLiking] = useState(false);

  /* * [핵심 변경] 본인 확인 로직
   * 게시글의 authorId와 내 memberId를 비교합니다.
   */
  const isAuthor = post && Number(currentMemberId) === post.authorId;

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

  const handleLike = async () => {
    if (!post || isLiking) return;
    setIsLiking(true);
    try {
      const updatedLikes = await addLike(post.id);
      setPost({ ...post, likesCount: updatedLikes });
    } catch (error) {
      alert("좋아요 처리에 실패했습니다.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!post || !newComment.trim()) return;
    try {
      await createComment(post.id, newComment);
      setNewComment("");
      fetchDetail();
    } catch (error) {
      alert("댓글 등록 실패!");
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?\n삭제된 글은 복구할 수 없습니다.")) {
      try {
        await deletePost(post.id);
        alert("게시글이 정상적으로 삭제되었습니다. ✨");
        navigate("/community"); // 삭제 후 목록으로 이동
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("글을 삭제하는 중 오류가 발생했습니다.");
      }
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

          {post.images?.length > 0 && (
            <div className="rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <img
                src={`http://localhost:8080${post.images[0].imageUrl}`}
                className="w-full object-cover"
                alt="post"
                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x400?text=Image+Load+Failed"; }}
              />
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={handleLike} disabled={isLiking} className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500/20">
                  <Heart className={`h-5 w-5 ${post.likesCount > 0 ? 'fill-rose-500' : ''}`} /> {post.likesCount}
                </button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-zinc-400 font-bold">
                  <MessageCircle className="h-5 w-5" /> {post.commentCount}
                </div>
              </div>

              {/* ✅ 본인 확인 로직(ID 비교) 결과에 따라 버튼 노출 */}
              {isAuthor && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/community/edit/${post.id}`)}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Edit3 className="h-4 w-4" /> 수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
                  >
                    <Trash2 className="h-4 w-4" /> 삭제
                  </button>
                </div>
              )}
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
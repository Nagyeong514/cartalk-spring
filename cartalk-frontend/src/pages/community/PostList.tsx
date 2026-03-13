import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Eye, FileText, Tag, Heart, MessageCircle, TrendingUp, Pen, Flame, Car } from "lucide-react";
// ✅ 우리가 만든 API 트럭 가져오기
import { getPosts, PostListResponse } from "../../api/community";

export default function CommunityPostList() {
  const [activeCategory, setActiveCategory] = useState<string>("전체");
  const [posts, setPosts] = useState<PostListResponse[]>([]); // ✅ 진짜 데이터 바구니
  const [isLoading, setIsLoading] = useState(true);

  // 🚚 카테고리가 바뀔 때마다 서버에서 데이터를 새로 가져옵니다.
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await getPosts(activeCategory);
        setPosts(data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* 상단 통계 (아직은 Mock Data 유지) */}
        <section className="mb-6"><StatsRow stats={STATS} /></section>

        {/* 카테고리 탭 */}
        <section className="mb-6">
          <CategoryTabs categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
        </section>

        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="flex min-w-0 flex-1 flex-col gap-4">
            {isLoading ? (
              <div className="py-20 text-center">트럭이 데이터를 싣고 오는 중... 🐘</div>
            ) : posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">아직 이 카테고리에 글이 없어요!</p>
              </div>
            )}
          </section>

          {/* 사이드바 (Trending은 추후 백엔드 연결 필요) */}
          <aside className="w-full shrink-0 lg:w-80"><TrendingSidebar posts={TRENDING} /></aside>
        </div>
      </main>
      <FloatingWriteButton />
    </div>
  );
}

// ─── 수정된 PostCard (백엔드 데이터 매핑) ───────────────────────────────────────────
function PostCard({ post }: { post: PostListResponse }) {
  return (
    <Link to={`/community/${post.id}`} className="block">
      <article className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-accent/30 cursor-pointer">
        <div className="mb-3 flex items-center gap-2">
          {/* ✅ carTag는 아직 백엔드에 없으므로 카테고리로 임시 대체 */}
          <span className="inline-flex items-center gap-1 rounded-md border border-cartalk-cyan/30 bg-cartalk-cyan/15 px-2.5 py-0.5 text-xs font-semibold text-cartalk-cyan">
            <Car className="h-3 w-3" />
            {post.category}
          </span>
          {/* 좋아요가 10개 이상이면 HOT 배지 노출 로직 추가 가능 */}
          {post.likesCount >= 10 && (
            <span className="flex items-center gap-1 rounded-md bg-cartalk-rose/15 px-2 py-0.5 text-xs font-semibold text-cartalk-rose">
              <Flame className="h-3 w-3" /> HOT
            </span>
          )}
        </div>

        <h3 className="mb-2 text-base font-bold text-foreground transition-colors group-hover:text-primary">{post.title}</h3>
        {/* 본문 미리보기는 백엔드 content의 일부를 잘라서 보여줍니다. */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
           게시글의 상세 내용을 확인하려면 클릭하세요...
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              {post.authorName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-foreground">{post.authorName}</span>
            {/* ✅ 백엔드 TimeUtils의 "n시간 전" 적용 */}
            <span className="text-xs text-muted-foreground">{post.createdAt}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1 text-xs"><Heart className="h-3.5 w-3.5" />{post.likesCount}</span>
            <span className="flex items-center gap-1 text-xs"><MessageCircle className="h-3.5 w-3.5" />{post.commentCount}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
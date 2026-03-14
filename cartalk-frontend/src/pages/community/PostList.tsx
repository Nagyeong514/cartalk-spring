import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, Eye, FileText, Tag, Heart, MessageCircle, TrendingUp, Pen, Flame, Car
} from "lucide-react";

// ✅ 우리가 만든 API 트럭 가져오기
import { getPosts, getTrendingPosts, getCommunityStats, PostListResponse } from "../../api/community";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface StatCardData {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function CommunityPostList() {
  const [activeCategory, setActiveCategory] = useState<string>("전체");
  const [posts, setPosts] = useState<PostListResponse[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<PostListResponse[]>([]);
  // ✅ [수정] 초기값을 0으로 꽉 채워줍니다. (하얀 화면 방지 핵심!)
    const [stats, setStats] = useState<CommunityStatsResponse>({
      totalPosts: 0,
      postsToday: 0,
      totalMembers: 0,
      memberGrowth: 0,
      uniqueTagsCount: 0
    });

  const [isLoading, setIsLoading] = useState(true);

  // 🚚 서버에서 모든 데이터를 싣고 옵니다.
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        // 게시글 목록, 인기글, 통계를 동시에 가져옵니다.
        const [postsData, trendingData, statsData] = await Promise.all([
          getPosts(activeCategory),
          getTrendingPosts(),
          getCommunityStats()
        ]);
        setPosts(postsData);
        setTrendingPosts(trendingData);
        setStats(statsData);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [activeCategory]);

// ✅ [수정] 데이터가 없을 때를 대비해 || 0 안전장치를 추가합니다.
  const statCards: StatCardData[] = [
    { label: "Daily Visitors", value: "12,847", change: "+12.5%", icon: <Eye className="h-5 w-5" />, color: "text-cartalk-cyan" },
    {
      label: "Active Users",
      value: (stats.totalMembers || 0).toLocaleString(),
      change: `+${stats.memberGrowth || 0}%`,
      icon: <Users className="h-5 w-5" />,
      color: "text-cartalk-emerald"
    },
    {
      label: "Total Posts",
      value: (stats.totalPosts || 0).toLocaleString(),
      change: `+${stats.postsToday || 0}`,
      icon: <FileText className="h-5 w-5" />,
      color: "text-cartalk-amber"
    },
    {
      label: "Car Tags",
      value: (stats.uniqueTagsCount || 0).toLocaleString(),
      change: "Live",
      icon: <Tag className="h-5 w-5" />,
      color: "text-cartalk-rose"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* 1. 상단 통계 로우 */}
        <section className="mb-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statCards.map((s) => (
              <div key={s.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cartalk-surface ${s.color}`}>{s.icon}</div>
                <div className="min-w-0">
                  <p className="truncate text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-cartalk-emerald">{s.change}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. 카테고리 탭 */}
        <section className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["전체", "정비/수리", "튜닝", "내 차 자랑", "질문/답변"].map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  c === activeCategory ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 3. 게시글 메인 리스트 */}
          <section className="flex min-w-0 flex-1 flex-col gap-4">
            {isLoading ? (
              <div className="py-20 text-center text-muted-foreground font-medium animate-pulse">트럭이 데이터를 싣고 오는 중... 🐘</div>
            ) : posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">아직 이 카테고리에 글이 없어요!</p>
              </div>
            )}
          </section>

          {/* 4. 사이드바 (Trending Posts) */}
          <aside className="w-full shrink-0 lg:w-80">
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cartalk-rose" />
                  <h3 className="text-sm font-bold text-foreground">Trending Posts</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {trendingPosts.map((p, index) => (
                    <Link key={p.id} to={`/community/${p.id}`} className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${index < 3 ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>{index + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">{p.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Heart className="h-3 w-3" />{p.likesCount.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 5. 플로팅 글쓰기 버튼 */}
      <Link to="/community/write" className="fixed right-6 bottom-6 z-50 flex h-14 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105">
        <Pen className="h-4 w-4" /> Write
      </Link>
    </div>
  );
}

// ─── PostCard 컴포넌트 ──────────────────────────────────────────────────────────
function PostCard({ post }: { post: PostListResponse }) {
  return (
    <Link to={`/community/${post.id}`} className="block">
      <article className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-accent/30 cursor-pointer">

        {/* 전체를 가로 배치 (flex-row) */}
        <div className="flex gap-5 sm:gap-8">

          {/* 1. 텍스트 영역: 남은 공간 모두 차지 (flex-1) */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <Car className="h-3 w-3" />
                  #{post.carTag || "CarTalk"}
                </span>
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{post.category}</span>
                {post.isHot && (
                  <span className="flex items-center gap-1 rounded-md bg-cartalk-rose/15 px-2 py-0.5 text-xs font-semibold text-cartalk-rose">
                    <Flame className="h-3 w-3" /> HOT
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-base sm:text-lg font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
                {post.title}
              </h3>
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {post.preview}
              </p>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {post.authorName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">{post.authorName}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">{post.createdAt}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1 text-xs"><Heart className="h-3.5 w-3.5" />{post.likesCount}</span>
                <span className="flex items-center gap-1 text-xs"><MessageCircle className="h-3.5 w-3.5" />{post.commentCount}</span>
              </div>
            </div>
          </div>

          {/* 2. 썸네일 영역: 사진이 있을 때만 렌더링 */}
          {post.imageUrl && (
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 shadow-inner">
              <img
                src={`http://localhost:8080${post.imageUrl}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="thumbnail"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              {/* 이미지 위에 은은한 그라데이션 오버레이 (디자인 디테일) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
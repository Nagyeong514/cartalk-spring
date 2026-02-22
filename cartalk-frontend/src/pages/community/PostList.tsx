//커뮤니티 페이지
import { useState } from "react";
// 1. Next.js용 Link 대신 리액트 라우터용 Link를 가져옵니다!
import { Link } from "react-router-dom";
import {
  Users,
  Eye,
  FileText,
  Tag,
  Heart,
  MessageCircle,
  TrendingUp,
  Droplets,
  Sun,
  Pen,
  ChevronRight,
  Flame,
  Car,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

interface PostItem {
  id: number;
  category: string;
  carTag: string;
  tagColor: string;
  title: string;
  preview: string;
  author: string;
  avatar: string;
  date: string;
  likes: number;
  comments: number;
  isHot?: boolean;
}

interface TrendingPost {
  id: number;
  rank: number;
  title: string;
  likes: number;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const STATS: StatCard[] = [
  {
    label: "Daily Visitors",
    value: "12,847",
    change: "+12.5%",
    icon: <Eye className="h-5 w-5" />,
    color: "text-cartalk-cyan", // tailwind.config.ts에 추가한 색상을 사용합니다!
  },
  {
    label: "Active Users",
    value: "3,241",
    change: "+8.2%",
    icon: <Users className="h-5 w-5" />,
    color: "text-cartalk-emerald",
  },
  {
    label: "Total Posts",
    value: "48,392",
    change: "+324",
    icon: <FileText className="h-5 w-5" />,
    color: "text-cartalk-amber",
  },
  {
    label: "New Car Tags",
    value: "156",
    change: "+23",
    icon: <Tag className="h-5 w-5" />,
    color: "text-cartalk-rose",
  },
];

const CATEGORIES = [
  "전체",
  "정비/수리",
  "튜닝",
  "내 차 자랑",
  "질문/답변",
] as const;

const POSTS: PostItem[] = [
  {
    id: 1,
    category: "튜닝",
    carTag: "#AvanteN",
    tagColor: "bg-cartalk-cyan/15 text-cartalk-cyan border-cartalk-cyan/30",
    title: "아반떼N 스테이지2 튜닝 후기 (ECU + 배기)",
    preview: "3개월간 진행한 스테이지2 튜닝 과정을 공유합니다...",
    author: "SpeedKing_KR",
    avatar: "SK",
    date: "2시간 전",
    likes: 247,
    comments: 89,
    isHot: true,
  },
  {
    id: 2,
    category: "정비/수리",
    carTag: "#BMW320i",
    tagColor: "bg-cartalk-amber/15 text-cartalk-amber border-cartalk-amber/30",
    title: "BMW 320i 냉각수 누수 자가 정비 도전기",
    preview: "갑자기 냉각수 경고등이 들어와서 직접 진단하고 수리한 과정입니다...",
    author: "DIY_Mechanic",
    avatar: "DM",
    date: "4시간 전",
    likes: 183,
    comments: 64,
  },
  // ... 생략된 데이터는 v0 원본을 그대로 유지하셔도 무방합니다.
];

const TRENDING: TrendingPost[] = [
  { id: 1, rank: 1, title: "2026 신형 그랜저 사전 스파이샷 유출", likes: 1247 },
  { id: 2, rank: 2, title: "아반떼N 스테이지2 튜닝 후기", likes: 893 },
  { id: 3, rank: 3, title: "전기차 겨울 연비 비교 테스트", likes: 756 },
  { id: 4, rank: 4, title: "셀프 세차 장비 추천 리스트", likes: 634 },
  { id: 5, rank: 5, title: "K8 vs 그랜저 실구매자 비교 리뷰", likes: 521 },
];

// ─── Sub-Components ─────────────────────────────────────────────────────────────

function StatsRow({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cartalk-surface ${s.color}`}>
            {s.icon}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">{s.label}</p>
            <p className="text-lg font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-cartalk-emerald">{s.change}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryTabs({ categories, active, onChange }: { categories: readonly string[]; active: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all ${
            c === active ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

// ─── PostCard
function PostCard({ post }: { post: PostItem }) {
  return (
    <Link to={`/community/${post.id}`} className="block">
      <article className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:bg-accent/30 cursor-pointer">
        <div className="mb-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${post.tagColor}`}>
            <Car className="h-3 w-3" />
            {post.carTag}
          </span>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{post.category}</span>
          {post.isHot && (
            <span className="flex items-center gap-1 rounded-md bg-cartalk-rose/15 px-2 py-0.5 text-xs font-semibold text-cartalk-rose">
              <Flame className="h-3 w-3" />
              HOT
            </span>
          )}
        </div>
        <h3 className="mb-2 text-base font-bold text-foreground transition-colors group-hover:text-primary">{post.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.preview}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">{post.avatar}</div>
            <span className="text-sm font-medium text-foreground">{post.author}</span>
            <span className="text-xs text-muted-foreground">{post.date}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1 text-xs"><Heart className="h-3.5 w-3.5" />{post.likes}</span>
            <span className="flex items-center gap-1 text-xs"><MessageCircle className="h-3.5 w-3.5" />{post.comments}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function TrendingSidebar({ posts }: { posts: TrendingPost[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-cartalk-rose" />
          <h3 className="text-sm font-bold text-foreground">Trending Posts</h3>
        </div>
        <div className="flex flex-col gap-3">
          {posts.map((p) => (
            <div key={p.id} className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${p.rank <= 3 ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>{p.rank}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">{p.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Heart className="h-3 w-3" />{p.likes.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 세차 지수 위젯 등은 원본 유지 */}
    </div>
  );
}



function FloatingWriteButton() {
  return (
    <Link
      to="/community/write" // 1. href가 아니라 'to'여야 합니다!
      className="fixed right-6 bottom-6 z-50 flex h-14 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105"
    >
      <Pen className="h-4 w-4" />
      Write
    </Link>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function CommunityPostList() {
  const [activeCategory, setActiveCategory] = useState<string>("전체");
  const filteredPosts = activeCategory === "전체" ? POSTS : POSTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground dark"> {/* 다크 모드를 강제 적용합니다 */}
      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <section className="mb-6"><StatsRow stats={STATS} /></section>
        <section className="mb-6"><CategoryTabs categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} /></section>
        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="flex min-w-0 flex-1 flex-col gap-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
                <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">No posts in this category yet.</p>
              </div>
            )}
          </section>
          <aside className="w-full shrink-0 lg:w-80"><TrendingSidebar posts={TRENDING} /></aside>
        </div>
      </main>
      <FloatingWriteButton />
    </div>
  );
}
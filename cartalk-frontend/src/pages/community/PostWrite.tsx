import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Car, ImagePlus, X, Upload, ChevronDown, Hash, Type, AlignLeft, Send
} from "lucide-react";

// ✅ 진짜 서버로 데이터를 보내줄 API 트럭 가져오기
import { createPost } from "../../api/community";

// ─── Types ──────────────────────────────────────────────────────────────────────
interface ImagePreview {
  id: string;
  url: string;
  name: string;
  file: File; // ✅ 서버에 전송할 진짜 파일 객체 추가
}

// ─── Constants ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "정비/수리", label: "정비/수리" },
  { value: "튜닝", label: "튜닝" },
  { value: "내 차 자랑", label: "내 차 자랑" },
  { value: "질문/답변", label: "질문/답변" },
] as const;

// ─── Sub-Components (디자인 유지) ──────────────────────────────────────────────────

function CategorySelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = CATEGORIES.find((c) => c.value === value);

  return (
    <div className="relative">
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Car className="h-4 w-4 text-primary" /> Category
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-colors hover:bg-accent focus:ring-2 focus:ring-ring focus:outline-none"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.label : "Select a category..."}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-20 mt-2 w-full rounded-xl border border-border bg-card shadow-xl">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => { onChange(c.value); setOpen(false); }}
              className={`flex w-full items-center px-4 py-3 text-left text-sm transition-colors hover:bg-accent ${c.value === value ? "bg-primary/10 font-semibold text-primary" : "text-foreground"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TagInput({ tags, onAdd, onRemove }: { tags: string[]; onAdd: (tag: string) => void; onRemove: (tag: string) => void }) {
  const [input, setInput] = useState("");
  const handleAdd = () => {
    const cleaned = input.replace(/^#/, "").trim();
    if (cleaned && !tags.includes(cleaned)) onAdd(cleaned);
    setInput("");
  };

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><Hash className="h-4 w-4 text-primary" />Car Model Tags</label>
      {tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              #{tag}
              <button type="button" onClick={() => onRemove(tag)}><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          placeholder="Type a car model... (e.g. AvanteN)"
          className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        />
        <button type="button" onClick={handleAdd} className="rounded-xl bg-primary/15 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/25">Add</button>
      </div>
    </div>
  );
}

// ... TitleInput, ContentTextarea, ImageUploadZone 컴포넌트들은 나경님의 원본 코드와 동일하여 생략 (파일 복사시 그대로 유지하세요)

// ─── Main Page (실제 로직 통합) ──────────────────────────────────────────────────

export default function CommunityPostWrite() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 제출 중 중복 클릭 방지

  const addTag = (tag: string) => { if (!tags.includes(tag)) setTags([...tags, tag]); };
  const removeTag = (tag: string) => { setTags(tags.filter((t) => t !== tag)); };

  const addImages = (files: FileList) => {
    const newImages = Array.from(files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
      name: file.name,
      file: file // ✅ 서버 전송용 원본 파일 보관
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((img) => img.id !== id);
    });
  };

  const isValid = category && title.trim().length > 0 && content.trim().length > 0;

  // 🚀 [진짜 제출 로직] 백엔드로 전송
  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    // 📦 1. Multipart/form-data 주머니 만들기
    const formData = new FormData();

    // 📦 2. 게시글 메타데이터(JSON) 준비
    const requestDto = {
      title,
      content,
      category,
      carTag: tags.join(","), // ✅ 여러 태그를 "BMW,K5" 처럼 쉼표로 합침
    };

    // 📦 3. JSON 데이터를 Blob 형태로 주머니에 넣기 (백엔드 @RequestPart와 짝꿍)
    formData.append(
      "requestDto",
      new Blob([JSON.stringify(requestDto)], { type: "application/json" })
    );

    // 📦 4. 이미지 파일들을 주머니에 넣기
    images.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      // 🚚 5. 서버로 트럭 출발!
      const postId = await createPost(formData);
      alert("게시글이 성공적으로 등록되었습니다! 🏎️💨");
      navigate(`/community`); // 목록으로 이동하거나 상세페이지로 이동
    } catch (error) {
      console.error("제출 실패:", error);
      alert("글 등록 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <main className="mx-auto max-w-3xl px-4 py-8 lg:px-0">
        <div className="flex flex-col gap-8">
          <CategorySelector value={category} onChange={setCategory} />
          <TagInput tags={tags} onAdd={addTag} onRemove={removeTag} />
          <div className="border-t border-border" />
          <TitleInput value={title} onChange={setTitle} />
          {/* ContentTextarea 컴포넌트 호출 */}
          <ContentTextarea value={content} onChange={setContent} />
          {/* ImageUploadZone 컴포넌트 호출 */}
          <ImageUploadZone images={images} onAdd={addImages} onRemove={removeImage} />

          <div className="border-t border-border" />
          <div className="flex items-center justify-end gap-3">
            <Link to="/community" className="rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-semibold hover:bg-accent">
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
            >
              {isSubmitting ? "Uploading..." : <><Send className="h-4 w-4" />Submit Post</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
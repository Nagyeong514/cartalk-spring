import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Car,
  ImagePlus,
  X,
  Upload,
  ChevronDown,
  Hash,
  Type,
  AlignLeft,
  Send,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────
interface ImagePreview {
  id: string;
  url: string;
  name: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "maintenance", label: "정비/수리" },
  { value: "tuning", label: "튜닝" },
  { value: "showcase", label: "내 차 자랑" },
  { value: "qna", label: "질문/답변" },
] as const;

const SUGGESTED_TAGS = [
  "BMW", "Tesla", "AvanteN", "GV70", "K5", "Sonata", "Grandeur", "EV6", "IONIQ5", "ModelY",
] as const;

// ─── Sub-Components ─────────────────────────────────────────────────────────────

function CategorySelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = CATEGORIES.find((c) => c.value === value);

  return (
    <div className="relative">
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Car className="h-4 w-4 text-primary" />
        Category
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
          placeholder="Type a car model..."
          className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        />
        <button type="button" onClick={handleAdd} className="rounded-xl bg-primary/15 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/25">Add</button>
      </div>
    </div>
  );
}

function TitleInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><Type className="h-4 w-4 text-primary" />Title</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a clear and engaging title..."
        className="w-full rounded-xl border border-border bg-secondary px-4 py-4 text-lg font-bold text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        maxLength={100}
      />
    </div>
  );
}

function ContentTextarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(200, textareaRef.current.scrollHeight)}px`;
    }
  };

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><AlignLeft className="h-4 w-4 text-primary" />Content</label>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder="Share your story..."
        className="w-full resize-none rounded-xl border border-border bg-secondary px-4 py-4 text-sm leading-relaxed text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        style={{ minHeight: 200 }}
      />
    </div>
  );
}

function ImageUploadZone({ images, onAdd, onRemove }: { images: ImagePreview[]; onAdd: (files: FileList) => void; onRemove: (id: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleDrag = useCallback((e: DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) onAdd(e.dataTransfer.files);
  }, [onAdd]);

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"><ImagePlus className="h-4 w-4 text-primary" />Images</label>
      <div
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${isDragging ? "border-primary bg-primary/5" : "border-border bg-secondary hover:border-primary/40"}`}
      >
        <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">Drag & drop images here</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && onAdd(e.target.files)} />
      </div>
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
              <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
              <button type="button" onClick={() => onRemove(img.id)} className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100"><X className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function CommunityPostWrite() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);

  const addTag = (tag: string) => { if (!tags.includes(tag)) setTags([...tags, tag]); };
  const removeTag = (tag: string) => { setTags(tags.filter((t) => t !== tag)); };
  const addImages = (files: FileList) => {
    const newImages = Array.from(files).map((file) => ({ id: `${Date.now()}-${file.name}`, url: URL.createObjectURL(file), name: file.name }));
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
  const handleSubmit = () => { if (isValid) navigate("/community"); };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <main className="mx-auto max-w-3xl px-4 py-8 lg:px-0">
        <div className="flex flex-col gap-8">
          <CategorySelector value={category} onChange={setCategory} />
          <TagInput tags={tags} onAdd={addTag} onRemove={removeTag} />
          <div className="border-t border-border" />
          <TitleInput value={title} onChange={setTitle} />
          <ContentTextarea value={content} onChange={setContent} />
          <ImageUploadZone images={images} onAdd={addImages} onRemove={removeImage} />
          <div className="border-t border-border" />
          <div className="flex items-center justify-end gap-3">
            <Link to="/community" className="rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-semibold hover:bg-accent">Cancel</Link>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-4 w-4" />Submit Post
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
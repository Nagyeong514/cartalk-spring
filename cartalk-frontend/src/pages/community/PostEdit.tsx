import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Image as ImageIcon, ChevronLeft, Check, Car, Tag } from "lucide-react";
import { getPostDetail, updatePost } from "../../api/community";

export default function PostEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 폼 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [carTag, setCarTag] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["정비/수리", "튜닝", "내 차 자랑", "질문/답변"];

  // 1. 기존 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const data = await getPostDetail(Number(id));
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
        setCarTag(data.carTag);
        // 기존 이미지는 미리보기로 보여주지 않고(교체 방식이므로),
        // 새 이미지를 선택했을 때만 미리보기가 작동하도록 비워둡니다.
      } catch (error) {
        alert("게시글 정보를 불러오는 데 실패했습니다.");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages(fileArray);

      // 미리보기 생성
      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewArray);
    }
  };

  // 2. 수정 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || isSubmitting) return;

    if (!title.trim() || !content.trim() || !category) {
      alert("제목, 내용, 카테고리는 필수 입력 사항입니다.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    const requestDto = { title, content, category, carTag };

    // JSON 데이터를 Blob으로 만들어 'requestDto'라는 이름으로 추가
    formData.append(
      "requestDto",
      new Blob([JSON.stringify(requestDto)], { type: "application/json" })
    );

    // 새 이미지가 있을 때만 추가 (백엔드에서 이미지가 들어오면 교체하는 로직)
    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await updatePost(Number(id), formData);
      alert("글이 성공적으로 수정되었습니다! ✨");
      navigate(`/community/${id}`);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("글 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-primary border-white/10 animate-spin" />
          <p className="font-bold text-zinc-400">글 정보를 불러오는 중... 🐘</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans pb-20">
      {/* 1. 상단 헤더: 더 선명한 대비와 강조된 Save 버튼 */}
      <header className="sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/10 rounded-full transition-all text-zinc-400 hover:text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <h1 className="text-sm font-black tracking-[0.2em] text-zinc-400">EDIT POST</h1>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#2dd4bf] text-[#09090b] rounded-full font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Saving...</span>
          ) : (
            <><Check className="h-4 w-4 stroke-[3px]" /> SAVE</>
          )}
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {/* 2. 카테고리 선택: 선택된 항목이 더 눈에 띄게 */}
        <section className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 ml-1">
            <Car className="h-3 w-3" /> Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border-2 ${
                  category === c
                  ? "bg-[#2dd4bf] border-[#2dd4bf] text-[#09090b] shadow-[0_10px_20px_rgba(45,212,191,0.15)]"
                  : "bg-[#121214] border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* 3. 제목 입력: 플레이스홀더 밝기 조정 */}
        <section className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a title..."
            className="w-full bg-transparent text-5xl font-black placeholder:text-zinc-700 border-none focus:ring-0 p-0 text-white"
          />
        </section>

        {/* 4. 차량 태그 입력: 테두리 강조 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-6 py-5 bg-[#121214] border border-white/10 rounded-3xl focus-within:border-[#2dd4bf]/50 focus-within:bg-[#161618] transition-all group">
            <Tag className="h-5 w-5 text-zinc-600 group-focus-within:text-[#2dd4bf]" />
            <input
              type="text"
              value={carTag}
              onChange={(e) => setCarTag(e.target.value)}
              placeholder="Car model or tag (ex. GV80, Avante)"
              className="bg-transparent border-none focus:ring-0 p-0 text-base w-full text-zinc-200 placeholder:text-zinc-600"
            />
          </div>
        </section>

        {/* 5. 본문 입력: 폰트 가독성 상향 */}
        <section className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="w-full bg-transparent text-zinc-300 text-xl leading-relaxed placeholder:text-zinc-700 border-none focus:ring-0 p-0 min-h-[400px] resize-none"
          />
        </section>

        {/* 6. 이미지 업로드: 깔끔한 그리드와 안내 문구 */}
        <section className="space-y-6 pt-6 border-t border-white/5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 ml-1">
            <ImageIcon className="h-3 w-3" /> Photos
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <label className="aspect-square flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-white/10 bg-[#121214] hover:bg-white/5 hover:border-[#2dd4bf]/40 transition-all cursor-pointer group">
              <ImageIcon className="h-10 w-10 text-zinc-700 group-hover:text-[#2dd4bf] transition-colors mb-3" />
              <span className="text-xs font-bold text-zinc-600 group-hover:text-zinc-400">Change Photos</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {/* 새 이미지 미리보기 */}
            {imagePreviews.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-xl">
                <img src={src} alt="preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <button
                  type="button"
                  onClick={() => {
                    setImages([]);
                    setImagePreviews([]);
                  }}
                  className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-[#121214] p-4 rounded-2xl border border-white/5">
            <p className="text-[11px] text-zinc-500 font-medium text-center">
               💡 <span className="text-zinc-400 font-bold">Tip:</span> 새로운 사진을 선택하면 기존 사진은 모두 교체됩니다.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
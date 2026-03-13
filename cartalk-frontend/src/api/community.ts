import apiClient from '../apiClient';

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface PostListResponse {
  id: number;
  category: string;
  carTag: string;
  title: string;
  preview: string;
  authorName: string;
  viewCount: number;
  likesCount: number;
  commentCount: number;
  isHot: boolean;
  createdAt: string;
}

export interface CommentDto {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface PostDetailResponse {
  id: number;
  category: string;
  carTag: string;
  title: string;
  content: string;
  authorName: string;
  viewCount: number;
  likesCount: number;
  commentCount: number;
  createdAt: string;
  images: { id: number; imageUrl: string; originName: string }[];
  comments: CommentDto[];
}

export interface CommunityStatsResponse {
  totalPosts: number;
  totalMembers: number;
}

// ─── API Functions (백엔드 컨트롤러와 번호 맞춤) ───────────────────────────────────

// 1. 게시글 목록 가져오기
export const getPosts = async (category?: string) => {
  const response = await apiClient.get<PostListResponse[]>('/api/community/posts', {
    params: { category: category === '전체' ? undefined : category }
  });
  return response.data;
};

// 2. 게시글 작성 (이미지 업로드 포함!)
// 💡 나경님, 이미지 업로드가 바로 이 함수예요! (FormData에 이미지를 담아 보냅니다)
export const createPost = async (formData: FormData) => {
  const response = await apiClient.post<number>('/api/community/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 3. 게시글 상세 보기
export const getPostDetail = async (id: number) => {
  const response = await apiClient.get<PostDetailResponse>(`/api/community/posts/${id}`);
  return response.data;
};

// 4. 댓글 등록
export const createComment = async (postId: number, content: string) => {
  const response = await apiClient.post(`/api/community/posts/${postId}/comments`, { content });
  return response.data;
};

// 5. 좋아요(하트) 클릭 (새로 추가!)
export const addLike = async (id: number) => {
  const response = await apiClient.post(`/api/community/posts/${id}/like`);
  return response.data; // 서버에서 리턴해주는 최신 좋아요 숫자
};

// 6. 인기 게시글 상위 5개 가져오기 (Trending)
export const getTrendingPosts = async () => {
  const response = await apiClient.get<PostListResponse[]>('/api/community/posts/trending');
  return response.data;
};

// 7. 커뮤니티 상단 통계 정보 가져오기 (Stats)
export const getCommunityStats = async () => {
  const response = await apiClient.get<CommunityStatsResponse>('/api/community/posts/stats');
  return response.data;
};
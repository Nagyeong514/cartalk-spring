import apiClient from '../apiClient';

// 백엔드에서 만든 DTO와 이름표를 똑같이 맞춰줍니다.
export interface PostListResponse {
  id: number;
  category: string;
  title: string;
  authorName: string;
  viewCount: number;
  likesCount: number;
  commentCount: number;
  createdAt: string; // "3시간 전" 같은 예쁜 날짜
}

// 🚚 게시글 목록 가져오기 함수
export const getPosts = async (category?: string) => {
  const response = await apiClient.get<PostListResponse[]>('/api/community/posts', {
    params: { category: category === '전체' ? undefined : category }
  });
  return response.data;
};
package com.cartalkpro.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommunityStatsResponseDto {
    private long totalPosts;       // 전체 게시글
    private long postsToday;       // 오늘 올라온 글 (+324 역할)
    private long totalMembers;     // 전체 회원
    private double memberGrowth;   // 회원 증가율 (+8.2% 역할)
    private long uniqueTagsCount;  // 등록된 고유 태그 수
}
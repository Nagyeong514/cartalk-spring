package com.cartalkpro.domain.community.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommunityStatsResponseDto {
    private long totalPosts;   // 전체 게시글 수
    private long totalMembers; // 전체 회원 수
}
package com.cartalkpro.domain.community.dto;

import com.cartalkpro.domain.community.entity.Post;
import com.cartalkpro.global.util.TimeUtils;    //"몇시간 전"
import lombok.Getter;

@Getter
public class PostListResponseDto {
    private Long id;
    private String category;
    private String title;
    private String authorName;
    private int viewCount;
    private int likesCount;
    private int commentCount;
    private String createdAt;
    private String carTag;   // 차량 태그
    private String preview;  // 본문 요약
    private boolean isHot;      // HOT 배지


    public PostListResponseDto(Post post) {
        this.id = post.getId();
        this.category = post.getCategory();
        this.title = post.getTitle();
        this.authorName = post.getMember().getName();
        this.viewCount = post.getViewCount();
        this.likesCount = post.getLikesCount();
        this.commentCount = post.getComments().size(); // 댓글 수 계산
        this.createdAt = TimeUtils.formatRelativeTime(post.getCreatedAt()); // "몇시간 전"
        this.carTag = post.getCarTag();

        // ✅ 본문이 너무 길면 50자만 자르고 "..."을 붙여서 '미리보기'를 만듭니다.
        String content = post.getContent();
        this.preview = content.length() > 50 ? content.substring(0, 50) + "..." : content;

        this.likesCount = post.getLikesCount();
        this.viewCount = post.getViewCount();

        this.isHot = post.getLikesCount() >= 10; // 좋아요 10개 이상이면 HOT!
    }
}
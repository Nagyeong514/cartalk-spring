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

    public PostListResponseDto(Post post) {
        this.id = post.getId();
        this.category = post.getCategory();
        this.title = post.getTitle();
        this.authorName = post.getMember().getName();
        this.viewCount = post.getViewCount();
        this.likesCount = post.getLikesCount();
        this.commentCount = post.getComments().size(); // 댓글 수 계산
        this.createdAt = TimeUtils.formatRelativeTime(post.getCreatedAt()); // "몇시간 전"
    }
}
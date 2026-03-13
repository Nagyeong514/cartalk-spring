package com.cartalkpro.domain.community.dto;

import com.cartalkpro.domain.community.entity.Post;
import com.cartalkpro.global.util.TimeUtils;
import lombok.Getter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PostDetailResponseDto {
    private Long id;
    private String category;
    private String title;
    private String content;
    private String authorName;
    private int viewCount;
    private int likesCount;
    private String createdAt;
    private List<CommentResponseDto> comments; // ✅ 댓글 목록 포함!

    public PostDetailResponseDto(Post post) {
        this.id = post.getId();
        this.category = post.getCategory();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.authorName = post.getMember().getName();
        this.viewCount = post.getViewCount();
        this.likesCount = post.getLikesCount();
        this.createdAt = TimeUtils.formatRelativeTime(post.getCreatedAt());
        this.comments = post.getComments().stream()
                .map(CommentResponseDto::new)
                .collect(Collectors.toList());
    }
}
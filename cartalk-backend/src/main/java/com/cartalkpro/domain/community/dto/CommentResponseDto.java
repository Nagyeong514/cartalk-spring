package com.cartalkpro.domain.community.dto;

import com.cartalkpro.domain.community.entity.Comment;
import com.cartalkpro.global.util.TimeUtils;
import lombok.Getter;

@Getter
public class CommentResponseDto {
    private Long id;
    private String content;
    private String authorName; //
    private String createdAt;

    public CommentResponseDto(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.authorName = comment.getMember().getName();
        this.createdAt = TimeUtils.formatRelativeTime(comment.getCreatedAt());
    }
}
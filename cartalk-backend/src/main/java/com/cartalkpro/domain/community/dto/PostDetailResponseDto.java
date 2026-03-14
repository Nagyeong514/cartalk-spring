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
    private String carTag;      // ✅ 추가: 태그도 상세에 보여주면 좋아요
    private int viewCount;
    private int likesCount;
    private String createdAt;
    private List<CommentResponseDto> comments;
    private List<PostImageResponseDto> images; // ✅ [핵심 추가] 이미지를 담을 리스트!

    public PostDetailResponseDto(Post post) {
        this.id = post.getId();
        this.category = post.getCategory();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.authorName = post.getMember().getName();
        this.carTag = post.getCarTag(); // ✅ 추가
        this.viewCount = post.getViewCount();
        this.likesCount = post.getLikesCount();
        this.createdAt = TimeUtils.formatRelativeTime(post.getCreatedAt());
        this.comments = post.getComments().stream()
                .map(CommentResponseDto::new)
                .collect(Collectors.toList());

        // ✅ [핵심 추가] 엔티티의 이미지를 DTO로 변환해서 담아줍니다.
        this.images = post.getImages().stream()
                .map(PostImageResponseDto::new)
                .collect(Collectors.toList());
    }

    // 내부 DTO 클래스 (간단하게 사진 정보만 담음)
    @Getter
    public static class PostImageResponseDto {
        private Long id;
        private String imageUrl;
        private String originName;

        public PostImageResponseDto(com.cartalkpro.domain.community.entity.PostImage image) {
            this.id = image.getId();
            this.imageUrl = image.getImageUrl();
            this.originName = image.getOriginName();
        }
    }
}
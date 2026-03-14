package com.cartalkpro.domain.community.entity;

import com.cartalkpro.domain.community.dto.PostUpdateRequestDto;
import com.cartalkpro.domain.member.entity.Member;
import com.cartalkpro.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Post extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "members_id")
    private Member member; // 작성자

    private String category; // 정비/수리, 튜닝 등
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String carTag;   // 태그

    // ✅ [수정] 중복되던 likesCount를 하나로 합치고 기본값을 설정합니다.
    @Builder.Default
    private int likesCount = 0;

    @Builder.Default
    private int viewCount = 0;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PostImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    // ─── 비즈니스 로직 (Setter 대신 이걸 쓰는 게 더 멋진 자바 개발자 스타일!) ───

    // 조회수 증가
    public void increaseViewCount() {
        this.viewCount++;
    }

    // 좋아요 증가
    public void increaseLikesCount() {
        this.likesCount += 1;
    }

    // 좋아요 취소
    public void decreaseLikesCount() {
        if (this.likesCount > 0) {
            this.likesCount -= 1;
        }
    }

    // 포스트 수정
    // Post 엔티티 내부에 추가
    public void update(PostUpdateRequestDto requestDto) {
        this.title = requestDto.getTitle();
        this.content = requestDto.getContent();
        this.category = requestDto.getCategory();
        this.carTag = requestDto.getCarTag();
    }
}
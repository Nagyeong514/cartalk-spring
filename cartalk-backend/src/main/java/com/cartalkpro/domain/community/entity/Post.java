package com.cartalkpro.domain.community.entity;

import com.cartalkpro.domain.member.entity.Member;
import com.cartalkpro.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
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

    // ✅ [수정 포인트] @Builder.Default를 붙여야 빌더로 객체를 만들 때도 0으로 시작합니다.
    @Builder.Default
    private int viewCount = 0;

    @Builder.Default
    private int likesCount = 0; // 성능 최적화를 위한 반정규화 컬럼

    private String carTag;   // 태그 추가

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PostImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    // ─── 비즈니스 로직 (엔티티가 스스로 데이터를 관리하게 합니다) ───

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
}
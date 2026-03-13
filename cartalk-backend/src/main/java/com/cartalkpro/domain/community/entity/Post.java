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

    private int viewCount;
    private int likesCount; // 성능 최적화를 위한 반정규화 컬럼

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // ✅ 빌더로 객체를 만들 때도 new ArrayList<>() 초기화를 유지합니다.
    private List<PostImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // ✅ 리스트가 null이 되어 발생하는 에러(NPE)를 원천 차단합니다!
    private List<Comment> comments = new ArrayList<>();

    // 조회수 증가 비즈니스 로직
    public void increaseViewCount() {
        this.viewCount ++;
    }

    // 좋아요 수도 엔티티가 스스로 관리
    public void increaseLikesCount() {
        this.likesCount += 1;
    }

    public void decreaseLikesCount() {
        if (this.likesCount > 0) {
            this.likesCount -= 1;
        }
    }
}


package com.cartalkpro.domain.community.dto;

import com.cartalkpro.domain.community.entity.Post;
import com.cartalkpro.domain.member.entity.Member;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostCreateRequestDto {
    private String category;
    private String title;
    private String content;
    private String carTag;  //차량 태그

    // ✅ DTO에 담긴 데이터를 DB에 저장할 'Post' 객체로 변환하는 핵심 로직입니다!
    public Post toEntity(Member member) {
        return Post.builder()
                .member(member)          // 글 작성자 정보 주입
                .category(this.category) // 선택한 카테고리 (정비/튜닝 등)
                .title(this.title)       // 글 제목
                .content(this.content)   // 글 내용
                .viewCount(0)            // 처음 글을 쓰니 조회수는 0
                .likesCount(0)           // 좋아요도 당연히 0
                .build();
    }
}
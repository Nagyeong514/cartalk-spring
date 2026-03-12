package com.cartalkpro.domain.community.repository;

import com.cartalkpro.domain.community.entity.Post;
import com.cartalkpro.domain.community.entity.PostLike;
import com.cartalkpro.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    // ✅ 특정 회원과 특정 게시글로 좋아요 여부 확인
    Optional<PostLike> findByMemberAndPost(Member member, Post post);
}
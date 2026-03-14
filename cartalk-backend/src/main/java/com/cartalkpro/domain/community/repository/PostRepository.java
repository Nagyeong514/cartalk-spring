package com.cartalkpro.domain.community.repository;

import com.cartalkpro.domain.community.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 전체 카테고리 최신순 정렬 조회
    List<Post> findAllByOrderByCreatedAtDesc();

    // 특정 카테고리 최신순 정렬 조회
    List<Post> findAllByCategoryOrderByCreatedAtDesc(String category);

    // 인기 게시글 상위 5개 조회
    List<Post> findTop5ByOrderByLikesCountDesc();
}
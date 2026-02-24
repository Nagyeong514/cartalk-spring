package com.cartalkpro.domain.community.repository;

import com.cartalkpro.domain.community.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // ✅ 카테고리별로 게시글 목록을 가져오는 마법의 한 줄
    List<Post> findAllByCategoryOrderByCreatedAtDesc(String category);
}
package com.cartalkpro.domain.community.controller;

import com.cartalkpro.domain.community.service.LikeService;
import com.cartalkpro.domain.community.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community/posts")
public class LikeController {

    private final LikeService likeService;
    private final PostService postService;

    @PostMapping("/{id}/like")
    // 3️⃣ [중요] (name = "id")를 꼭 써줘야 스프링이 주소창의 {id}를 찾아낼 수 있습니다!
    public ResponseEntity<Integer> toggleLike(@PathVariable(name = "id") Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 1. 좋아요 토글 처리 (좋아요 추가 혹은 취소)
        likeService.toggleLike(id, email);

        // 2. 최신 좋아요 숫자를 다시 가져옴
        // PostService에 이미 구현된 addLike 혹은 조회 로직을 활용하여 숫자를 반환
        int updatedLikes = postService.getPostDetail(id).getLikesCount();

        return ResponseEntity.ok(updatedLikes);
    }
}
package com.cartalkpro.domain.community.controller;

import com.cartalkpro.domain.community.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community/posts/{id}/like")
public class LikeController {

    private final LikeService likeService;

    // ❤️ 좋아요 토글 (누르면 좋아요, 다시 누르면 취소)
    @PostMapping
    public ResponseEntity<Boolean> toggleLike(@PathVariable Long id) {
        // ✅ 보안 필터를 통과한 사용자의 이메일을 꺼내옵니다.
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean isLiked = likeService.toggleLike(id, email);
        return ResponseEntity.ok(isLiked);
    }
}
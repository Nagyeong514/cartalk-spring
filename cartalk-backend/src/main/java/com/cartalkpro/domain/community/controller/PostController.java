package com.cartalkpro.domain.community.controller;

import com.cartalkpro.domain.community.dto.CommentRequestDto;
import com.cartalkpro.domain.community.dto.PostCreateRequestDto;
import com.cartalkpro.domain.community.dto.PostDetailResponseDto;
import com.cartalkpro.domain.community.dto.PostListResponseDto;
import com.cartalkpro.domain.community.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community/posts")

public class PostController {

    private final PostService postService;

    // 1. 게시글 목록 조회 (카테고리 필터링 포함)
    // GET http://localhost:8080/api/community/posts?category=튜닝
    @GetMapping
    public ResponseEntity<List<PostListResponseDto>> getPosts(
            @RequestParam(required = false) String category) {

        List<PostListResponseDto> posts = postService.getPosts(category);
        return ResponseEntity.ok(posts);
    }

    // ✍2. 게시글 작성 (로그인 필수)
    // POST http://localhost:8080/api/community/posts
    @PostMapping
    public ResponseEntity<Long> createPost(@RequestBody PostCreateRequestDto requestDto) {
        // ✅ [핵심] 보안 필터를 통과한 사용자의 이메일을 꺼내옵니다.
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Long postId = postService.createPost(requestDto, email);
        return ResponseEntity.ok(postId);
    }
    // 3. 게시글 상세 보기
    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponseDto> getPostDetail(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostDetail(id));
    }

    // 4. 댓글 작성
    @PostMapping("/{id}/comments")
    public ResponseEntity<Long> addComment(
            @PathVariable Long id,
            @RequestBody CommentRequestDto requestDto) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(postService.addComment(id, requestDto, email));
    }
}
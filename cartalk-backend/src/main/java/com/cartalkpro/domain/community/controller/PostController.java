package com.cartalkpro.domain.community.controller;

import com.cartalkpro.domain.community.dto.*;
import com.cartalkpro.domain.community.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/community/posts")
public class PostController {

    private final PostService postService;

    // 1. 게시글 목록 조회 (카테고리 필터링 포함)
    @GetMapping
    public ResponseEntity<List<PostListResponseDto>> getPosts(
            @RequestParam(name = "category", required = false) String category) { // ✅ name 추가

        List<PostListResponseDto> posts = postService.getPosts(category);
        return ResponseEntity.ok(posts);
    }

    // 2. 게시글 작성 (이미지 포함 버전)
    @PostMapping
    public ResponseEntity<Long> createPost(
            @RequestPart(name = "requestDto") PostCreateRequestDto requestDto, // ✅ name 추가
            @RequestPart(name = "images", required = false) List<MultipartFile> images // ✅ name 추가
    ) throws IOException {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 서비스의 '이미지 포함 버전' createPost를 호출!
        Long postId = postService.createPost(requestDto, images, email);
        return ResponseEntity.ok(postId);
    }

    // 3. 게시글 상세 보기
    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponseDto> getPostDetail(
            @PathVariable(name = "id") Long id) { // ✅ name 추가
        return ResponseEntity.ok(postService.getPostDetail(id));
    }

    // 4. 댓글 작성
    @PostMapping("/{id}/comments")
    public ResponseEntity<Long> addComment(
            @PathVariable(name = "id") Long id, // ✅ name 추가
            @RequestBody CommentRequestDto requestDto) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(postService.addComment(id, requestDto, email));
    }

    // 6. 인기 게시글 상위 5개 가져오기
    @GetMapping("/trending")
    public ResponseEntity<List<PostListResponseDto>> getTrendingPosts() {
        return ResponseEntity.ok(postService.getTrendingPosts());
    }

    // 7. 커뮤니티 상단 통계 조회
    @GetMapping("/stats")
    public ResponseEntity<CommunityStatsResponseDto> getStats() {
        return ResponseEntity.ok(postService.getCommunityStats());
    }
}
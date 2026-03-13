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
    // GET http://localhost:8080/api/community/posts?category=튜닝
    @GetMapping
    public ResponseEntity<List<PostListResponseDto>> getPosts(
            @RequestParam(required = false) String category) {

        List<PostListResponseDto> posts = postService.getPosts(category);
        return ResponseEntity.ok(posts);
    }

    // 2. 게시글 작성 (로그인 필수)
    // POST http://localhost:8080/api/community/posts
//    @PostMapping
//    public ResponseEntity<Long> createPost(@RequestBody PostCreateRequestDto requestDto) {
//        // ✅ [핵심] 보안 필터를 통과한 사용자의 이메일을 꺼내옵니다.
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//
//        Long postId = postService.createPost(requestDto, email);
//        return ResponseEntity.ok(postId);
//    }

    // 2. 게시글 작성 (5. 이미지 포함하자)
    @PostMapping
    public ResponseEntity<Long> createPost(
            @RequestPart("requestDto") PostCreateRequestDto requestDto, // ✅ JSON 데이터
            @RequestPart(value = "images", required = false) List<MultipartFile> images // ✅ 이미지 파일들
    ) throws IOException { // ✅ 파일 입출력 예외 처리

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 서비스의 '이미지 포함 버전' createPost를 호출합니다!
        Long postId = postService.createPost(requestDto, images, email);
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

    // 6. 인기 게시글 상위 5개 가져오기
    // GET http://localhost:8080/api/community/posts/trending
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
package com.cartalkpro.domain.community.service;

import com.cartalkpro.domain.community.dto.*;
import com.cartalkpro.domain.community.entity.Comment;
import com.cartalkpro.domain.community.entity.Post;
import com.cartalkpro.domain.community.entity.PostImage;
import com.cartalkpro.domain.community.repository.CommentRepository;
import com.cartalkpro.domain.community.repository.PostRepository;
import com.cartalkpro.domain.member.entity.Member;
import com.cartalkpro.domain.member.repository.MemberRepository;
import com.cartalkpro.global.util.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;
    private final FileService fileService;

    // 1. 글 쓰기 로직
    public Long createPost(PostCreateRequestDto requestDto, String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Post post = Post.builder()
                .member(member)
                .category(requestDto.getCategory())
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .viewCount(0)
                .likesCount(0)
                .build();

        return postRepository.save(post).getId();
    }

    // 2. 글 목록 가져오기 (필터링 포함)
    @Transactional(readOnly = true)
    public List<PostListResponseDto> getPosts(String category) {
        List<Post> posts;

        // 전체 카테고리 요청 시 정렬 메서드 사용
        if (category == null || category.equals("전체")) {
            posts = postRepository.findAllByOrderByCreatedAtDesc();
        } else {
            posts = postRepository.findAllByCategoryOrderByCreatedAtDesc(category);
        }

        return posts.stream()
                .map(PostListResponseDto::new)
                .collect(Collectors.toList());
    }

    // 3. 게시글 상세 보기 (조회수 증가 포함)
    @Transactional
    public PostDetailResponseDto getPostDetail(Long id) {
        // 1. 게시글 찾기
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));

        // 2. 조회수 증가! ✅
        post.increaseViewCount();

        // 3. DTO로 변환하여 반환
        return new PostDetailResponseDto(post);
    }

    // 4. 댓글 작성
    @Transactional
    public Long addComment(Long postId, CommentRequestDto requestDto, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Comment comment = Comment.builder()
                .post(post)
                .member(member)
                .content(requestDto.getContent())
                .build();

        return commentRepository.save(comment).getId();
    }

    //5. 이미지 파일 업로드
    // PostService.java 5번 메서드 수정 버전
    @Transactional
    public Long createPost(PostCreateRequestDto requestDto, List<MultipartFile> images, String email) throws IOException {
        Member member = memberRepository.findByEmail(email).orElseThrow();

        // ✅ toEntity 대신 직접 Builder 사용 (likesCount, viewCount 초기화 포함)
        Post post = Post.builder()
                .member(member)
                .category(requestDto.getCategory())
                .carTag(requestDto.getCarTag()) // 우리가 추가한 태그!
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .build();

        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String storeFilename = fileService.storeFile(image);
                PostImage postImage = PostImage.builder()
                        .post(post)
                        .imageUrl("/images/" + storeFilename)
                        .originName(image.getOriginalFilename())
                        .build();
                post.getImages().add(postImage);
            }
        }

        return postRepository.save(post).getId();
    }

    // 6. 인기글 가져오기
    @Transactional(readOnly = true)
    public List<PostListResponseDto> getTrendingPosts() {
        // 1. 저장소에서 인기글 5개를 가져옵니다.
        List<Post> trendingPosts = postRepository.findTop5ByOrderByLikesCountDesc();

        // 2. 엔티티 리스트를 DTO 리스트로 변환해서 돌려줍니다.
        return trendingPosts.stream()
                .map(PostListResponseDto::new)
                .toList();
    }

    // 7. 커뮤니티 상단 통계 조회
    @Transactional(readOnly = true)
    public CommunityStatsResponseDto getCommunityStats() {
        long postCount = postRepository.count();
        long memberCount = memberRepository.count();
        return new CommunityStatsResponseDto(postCount, memberCount);
    }

    //8. 좋아요 추가
    @Transactional // ✅ 데이터가 바뀌어야 하니까 꼭 붙여주세요!
    public int addLike(Long postId) {
        // 1. 게시글 찾기
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 2. 좋아요 수 증가
        post.increaseLikesCount();

        // 3. 바뀐 숫자 돌려주기 (프론트엔드 화면 업데이트용)
        return post.getLikesCount();
    }
}
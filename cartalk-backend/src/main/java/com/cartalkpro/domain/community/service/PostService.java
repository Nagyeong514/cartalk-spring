package com.cartalkpro.domain.community.service;

import com.cartalkpro.domain.community.dto.CommentRequestDto;
import com.cartalkpro.domain.community.dto.PostCreateRequestDto;
import com.cartalkpro.domain.community.dto.PostDetailResponseDto;
import com.cartalkpro.domain.community.dto.PostListResponseDto;
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

        if (category == null || category.equals("전체")) {
            posts = postRepository.findAll(); // 전체 조회
        } else {
            posts = postRepository.findAllByCategoryOrderByCreatedAtDesc(category); // 카테고리 필터링
        }

        return posts.stream()
                .map(PostListResponseDto::new) // 엔티티를 DTO 가방에 담기
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
    @Transactional
    public Long createPost(PostCreateRequestDto requestDto, List<MultipartFile> images, String email) throws IOException {
        // 1. 회원 찾기 및 게시글 생성 (기존 로직)
        Member member = memberRepository.findByEmail(email).orElseThrow();
        Post post = requestDto.toEntity(member);

        // 2. 이미지 파일 처리 ✅
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String storeFilename = fileService.storeFile(image);

                // PostImage 엔티티 생성 및 연관관계 설정
                PostImage postImage = PostImage.builder()
                        .post(post)
                        .imageUrl("/images/" + storeFilename) // 접근용 URL
                        .originName(image.getOriginalFilename())
                        .build();

                post.getImages().add(postImage); // Post 엔티티의 리스트에 추가
            }
        }

        return postRepository.save(post).getId();
    }
}
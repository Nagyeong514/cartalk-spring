package com.cartalkpro.domain.community.service;

import com.cartalkpro.domain.community.dto.PostCreateRequestDto;
import com.cartalkpro.domain.community.dto.PostListResponseDto;
import com.cartalkpro.domain.community.entity.Post;
import com.cartalkpro.domain.community.repository.PostRepository;
import com.cartalkpro.domain.member.entity.Member;
import com.cartalkpro.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

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
}
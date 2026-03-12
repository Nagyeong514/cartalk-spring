package com.cartalkpro.domain.community.service;

import com.cartalkpro.domain.community.entity.Post;
import com.cartalkpro.domain.community.entity.PostLike;
import com.cartalkpro.domain.community.repository.PostLikeRepository;
import com.cartalkpro.domain.community.repository.PostRepository;
import com.cartalkpro.domain.member.entity.Member;
import com.cartalkpro.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    public boolean toggleLike(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 존재하지 않습니다."));
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 🔍 이미 좋아요를 눌렀는지 확인
        return postLikeRepository.findByMemberAndPost(member, post)
                .map(postLike -> {
                    // 이미 있다면? 삭제 (좋아요 취소)
                    postLikeRepository.delete(postLike);
                    post.decreaseLikesCount();
                    return false; // 좋아요 취소됨을 반환
                })
                .orElseGet(() -> {
                    // 없다면? 저장 (좋아요 추가)
                    postLikeRepository.save(PostLike.builder()
                            .member(member)
                            .post(post)
                            .build());
                    post.increaseLikesCount();
                    return true; // 좋아요 추가됨을 반환
                });
    }
}
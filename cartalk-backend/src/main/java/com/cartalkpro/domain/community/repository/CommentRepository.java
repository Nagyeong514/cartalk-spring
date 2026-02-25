package com.cartalkpro.domain.community.repository;

import com.cartalkpro.domain.community.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
package com.cartalkpro.domain.community.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
    @NotBlank(message = "댓글 내용을 입력해주세요.") // 유효성 검사
    private String content;
}
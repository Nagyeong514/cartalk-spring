package com.cartalkpro.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

// 1. 가방 새로 만들기 (dto 패키지에 생성)
@Getter
@Builder
@AllArgsConstructor
public class LoginResponseDto {
    private String accessToken;
    private Long memberId;
    private String name;
}
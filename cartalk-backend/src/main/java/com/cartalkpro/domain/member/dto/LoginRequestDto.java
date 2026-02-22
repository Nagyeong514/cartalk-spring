package com.cartalkpro.domain.member.dto;
//로그인 데이터 가방

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor  // JSON 데이터를 객체로 변환할 때 필요한 기본 생성자
public class LoginRequestDto {
    private String email;
    private String password;
}
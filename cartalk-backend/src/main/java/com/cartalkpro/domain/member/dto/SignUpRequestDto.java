package com.cartalkpro.domain.member.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor  // [데이터 가방] 프론트에서 보낸 정보를 객체로 담을 때 필요한 기본 생성자
public class SignUpRequestDto {
    private String name;
    private String email;
    private String password;
    private String modelName;
    private int modelYear;
    private String vin; // 현재 UI엔 없지만 DB가 NOT NULL이므로 필드로 포함 // 차대번호 (데이터베이스 NOT NULL 제약조건 대응)
}
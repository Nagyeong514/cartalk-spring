package com.cartalkpro.domain.member.controller;
//회원가입 관문/입구

import com.cartalkpro.domain.member.dto.LoginRequestDto;
import com.cartalkpro.domain.member.dto.SignUpRequestDto;
import com.cartalkpro.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController     // JSON 형태의 데이터를 주고받는 API 컨트롤러 선언
@RequiredArgsConstructor    // MemberService를 자동으로 가져옴
@RequestMapping("/api/member") // API 경로 설정
public class MemberController {

    private final MemberService memberService;

    // 회원가입 API: [POST] http://localhost:8080/api/member/signup
    @PostMapping("/signup")
    public ResponseEntity<Long> signUp(@RequestBody SignUpRequestDto requestDto) {
        // @RequestBody: 프론트에서 보낸 JSON 데이터를 DTO 가방에 담아줌
        Long memberId = memberService.signUp(requestDto);
        return ResponseEntity.ok(memberId); // 성공 시 생성된 회원 ID를 반환
    }

    // 로그인 API
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto requestDto) {
        String token = memberService.login(requestDto);
        return ResponseEntity.ok(token); // 프론트엔드에 JWT 토큰을 띡! 던져줍니다.
    }
}
package com.cartalkpro.domain.member.controller;
//회원가입 관문/입구

import com.cartalkpro.domain.member.dto.LoginRequestDto;
import com.cartalkpro.domain.member.dto.LoginResponseDto; // ✅ 새로 만든 DTO 임포트
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

    // ✅ 로그인 API 수정: 반환 타입을 LoginResponseDto로 변경
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto requestDto) {
        // 1. 서비스에서 로그인 처리를 하고 필요한 정보를 가져옵니다.
        // (MemberService에 로그인 후 정보를 한꺼번에 반환하는 메서드를 만들면 더 깔끔합니다.)
        LoginResponseDto responseDto = memberService.loginProcess(requestDto);

        // 2. 이제 토큰만 주는 게 아니라 ID와 이름이 담긴 가방을 통째로 넘겨줍니다.
        return ResponseEntity.ok(responseDto);
    }
}
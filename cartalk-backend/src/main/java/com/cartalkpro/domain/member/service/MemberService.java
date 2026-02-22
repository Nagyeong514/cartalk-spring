package com.cartalkpro.domain.member.service;

import com.cartalkpro.domain.member.dto.LoginRequestDto;
import com.cartalkpro.domain.member.dto.SignUpRequestDto;
import com.cartalkpro.domain.member.entity.Member;
import com.cartalkpro.domain.member.repository.MemberRepository;
import com.cartalkpro.domain.vehicle.entity.Vehicle;
import com.cartalkpro.domain.vehicle.repository.VehicleRepository;
import com.cartalkpro.global.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service    // 이 클래스가 비즈니스 로직을 수행하는 서비스임을 스프링에 알림
@RequiredArgsConstructor    // final이 붙은 Repository들을 스프링이 자동으로 주입해줌
public class MemberService {

    private final MemberRepository memberRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;  // [주입] 등록한 암호화 기계를 가져옴
    private final JwtProvider jwtProvider;  // [주입] 토큰 기계를 가져옴

    @Transactional  // 중요: 회원가입과 차량등록이 '한 세트'로 처리됨 (하나라도 실패하면 전체 취소)
    public Long signUp(SignUpRequestDto requestDto) {
        // 1. 회원 정보 저장
        // 1. DTO 가방에서 정보를 꺼내 회원(Member) 객체 생성 및 저장
        Member member = Member.builder()
                .name(requestDto.getName())
                .email(requestDto.getEmail())
//                .password(requestDto.getPassword()) // 실제로는 암호화가 필요합니다!
                .password(passwordEncoder.encode(requestDto.getPassword())) // --> 암호화해서 저장!
                .role("USER")
                .build();

        Member savedMember = memberRepository.save(member);

        // 2. 차량 정보 저장 (회원과 연결)
        // 2. 저장된 회원 정보를 연결하여 차량(Vehicle) 객체 생성 및 저장
        Vehicle vehicle = Vehicle.builder()
                .member(savedMember)        // FK(외래키) 설정: 누구의 차인지 연결
                .modelName(requestDto.getModelName())
                .modelYear(requestDto.getModelYear())
                .vin(requestDto.getVin() == null ? "TEMP_VIN_" + savedMember.getId() : requestDto.getVin())
                .build();       // 가입 완료 후 생성된 회원 번호 반환

        vehicleRepository.save(vehicle);

        return savedMember.getId(); // 저장 성공 후 회원 번호 반환
    }

    //회원이 존재하는지, 비밀번호가 맞는지 확인하는 로직
    @Transactional(readOnly = true) // 로그인 조회는 읽기 전용으로 최적화
    public String login(LoginRequestDto requestDto) { // ✅ 반환 타입을 String(토큰)으로 변경
        // 1. 이메일로 회원 조회
        Member member = memberRepository.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        // 2. 비밀번호 일치 확인 (지금은 평문 비교, 곧 암호화 적용할게요!)
//        if (!member.getPassword().equals(requestDto.getPassword())) {
//            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
//        }
        // matches(평문 비번, 암호화된 비번)로 비교
        if (!passwordEncoder.matches(requestDto.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 로그인 성공 시 토큰 생성 및 반환
        return jwtProvider.createToken(member.getId(), member.getEmail(), member.getRole());
    }
}
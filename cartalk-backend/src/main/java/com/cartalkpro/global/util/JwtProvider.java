package com.cartalkpro.global.util;

// 토큰 관리 지휘본부

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component  // 스프링이 관리하는 컴포넌트로 등록
public class JwtProvider {

    // ✅ 나중에 application.properties에 설정할 값들입니다.
    @Value("${jwt.secret}") // application.properties에 설정한 비밀키를 가져옴
    private String secretKey;

    private final long tokenValidTime = 24 * 60 * 60 * 1000L; // [설정] 토큰 유효시간: 24시간
    private Key key;

    @PostConstruct  // 객체 생성 후 자동으로 실행되어 키를 초기화함
    protected void init() {
        // 비밀키를 Base64로 인코딩하여 초기화합니다.
        byte[] keyBytes = Base64.getEncoder().encode(secretKey.getBytes());
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // [1. 토큰 생성] 사용자의 ID, 이메일, 권한을 담은 안전한 토큰을 만듦
    public String createToken(Long memberId, String email, String role) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("memberId", memberId);
        claims.put("role", role);

        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims) // 데이터 저장
                .setIssuedAt(now)  // 토큰 발행 시간
                .setExpiration(new Date(now.getTime() + tokenValidTime)) // [중요] 만료 시간 설정
                .signWith(key, SignatureAlgorithm.HS256)    // HS256 알고리즘으로 암호화
                .compact();
    }

    // [2. 토큰 검증] 토큰이 변조되지 않았는지, 만료되지 않았는지 확인
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;   // 문제가 있는 토큰일 경우 false 반환
        }
    }

    // [3. 정보 추출] 토큰 내부에 저장된 사용자 정보(Claims)를 꺼냄
    public Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}
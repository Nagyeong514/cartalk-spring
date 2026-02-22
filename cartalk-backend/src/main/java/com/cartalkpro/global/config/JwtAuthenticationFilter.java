package com.cartalkpro.global.config;
//보안 검문소
//모든 API 요청이 들어올 때 헤더에 있는 토큰을 검사하여 유효하면 로그인을 승인해줍니다.

import com.cartalkpro.global.util.JwtProvider;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // ✅ 로그를 위해 추가
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Slf4j // ✅ 콘솔에 로그를 찍기 위한 어노테이션
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. [헤더 확인]
        String authorizationHeader = request.getHeader("Authorization");

        // 🔍 [로그] 어떤 헤더가 들어오는지 확인 (403 범인 검거용)
        log.info("Incoming request: {} {}", request.getMethod(), request.getRequestURI());

        // 2. [토큰 추출]
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            log.info("JWT Token found in header.");

            // 3. [검증 및 인증]
            if (jwtProvider.validateToken(token)) {
                Claims claims = jwtProvider.getClaims(token);
                String email = claims.getSubject();
                String role = (String) claims.get("role");

                log.info("Token validated for user: {}, role: {}", email, role);

                // 스프링 시큐리티 전용 인증 객체 생성
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        email, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));

                // 4. [보안 컨텍스트 저장]
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("Authentication set in SecurityContext.");
            } else {
                log.warn("Invalid JWT Token provided!");
            }
        } else {
            // ✅ 로그인이 필요 없는 경로는 여기서 "No token"이 뜨는 게 정상입니다.
            log.info("No Bearer token found in request header.");
        }

        // 다음 필터나 컨트롤러로 요청을 넘김
        filterChain.doFilter(request, response);
    }
}
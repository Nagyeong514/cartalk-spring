package com.cartalkpro.global.config;

import com.cartalkpro.global.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtProvider jwtProvider;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                // 1. 통합된 CORS 설정을 적용합니다.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // ✅ 1. 브라우저의 '예비 요청(OPTIONS)'을 무조건 허용합니다. (CORS 해결의 핵심!)
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // ✅ 2. 회원가입, 로그인 경로는 당연히 허용
                        .requestMatchers("/api/member/signup", "/api/member/login").permitAll()

                        // ✅ 3. 커뮤니티 목록 조회, 게시글 상세, 이미지 보기는 로그인 안 해도 볼 수 있게 허용
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/community/posts/**").permitAll()
                        .requestMatchers("/images/**").permitAll()

                        // 나머지는 로그인(JWT)이 필요함
                        .anyRequest().authenticated()
                )

                // 2. JWT 인증 필터를 보안 흐름 앞에 끼워넣습니다.
                .addFilterBefore(new JwtAuthenticationFilter(jwtProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 모든 CORS 정책을 여기서 집중 관리합니다.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // 5173 포트 허용 및 실제 인증 정보(Credentials) 공유 설정
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // JWT 통신을 위해 Authorization 헤더를 명시적으로 허용하는 것이 핵심입니다.
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L); // 프리플라이트 요청 캐싱 시간 (1시간)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
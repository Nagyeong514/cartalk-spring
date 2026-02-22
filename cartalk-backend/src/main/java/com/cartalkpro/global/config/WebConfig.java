package com.cartalkpro.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")      // 모든 경로(API)에 대해 설정 적용
                .allowedOrigins("http://localhost:5173") // [핵심] 프론트엔드 서버 주소만 접속 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 허용할 HTTP 메서드 지정
                .allowCredentials(true);    // 쿠키나 인증 정보를 포함한 요청 허용
    }
}
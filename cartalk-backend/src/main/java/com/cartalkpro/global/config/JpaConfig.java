package com.cartalkpro.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration  // 스프링의 설정 파일임을 나타냄
@EnableJpaAuditing  // JPA의 자동 시간 기록 기능(Auditing)을 활성화함
public class JpaConfig {
}
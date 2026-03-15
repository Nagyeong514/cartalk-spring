package com.cartalkpro.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * 외부 API 통신을 위한 RestTemplate 설정 클래스
 */
@Configuration
public class RestTemplateConfig {

    /**
     * RestTemplate을 Bean으로 등록하여 프로젝트 전역에서 주입받아 사용할 수 있도록 함
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
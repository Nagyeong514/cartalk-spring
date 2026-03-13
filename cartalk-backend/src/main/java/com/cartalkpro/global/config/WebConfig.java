package com.cartalkpro.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 브라우저가 /images/** 로 시작하는 주소로 요청을 보내면
        // 서버의 C:/cartalk_uploads/ 폴더에서 파일을 찾아 보여줍니다.
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///C:/cartalk_uploads/");
    }
}
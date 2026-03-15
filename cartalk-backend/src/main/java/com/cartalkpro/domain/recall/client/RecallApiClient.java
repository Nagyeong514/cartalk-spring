package com.cartalkpro.domain.recall.client;

import com.cartalkpro.domain.recall.dto.RecallResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

/**
 * 공공데이터포털 리콜 API와 통신을 담당하는 클라이언트 클래스
 */
@Component
@RequiredArgsConstructor
public class RecallApiClient {

    private final RestTemplate restTemplate;

    // ✅ 서비스 키 (공공데이터포털에서 발급받은 '인코딩된 키' 사용 권장)
    @Value("${public.api.key}")
    private String serviceKey;

    private static final String BASE_URL = "https://api.odcloud.kr/api/3048950/v1/uddi:c2fc6353-e2ab-4735-962b-a00b1879d8a7";

    /**
     * 특정 페이지의 리콜 데이터를 조회함
     */
    public RecallResponseDto fetchRecallData(int page, int perPage) {

        // ✅ [해결 포인트] UriComponentsBuilder 대신 직접 URL 문자열을 조립합니다.
        // API 키에 포함된 '=' 기호가 인코딩 과정에서 깨지거나 검증에 걸리는 것을 방지하기 위함입니다.
        String url = BASE_URL +
                "?serviceKey=" + serviceKey +
                "&page=" + page +
                "&perPage=" + perPage +
                "&returnType=JSON";

        // ✅ URI.create를 사용하면 Spring의 깐깐한 검증을 우회하고 원본 키 그대로 API에 전달할 수 있습니다.
        URI uri = URI.create(url);

        try {
            return restTemplate.getForObject(uri, RecallResponseDto.class);
        } catch (Exception e) {
            throw new RuntimeException("공공데이터 API 호출 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
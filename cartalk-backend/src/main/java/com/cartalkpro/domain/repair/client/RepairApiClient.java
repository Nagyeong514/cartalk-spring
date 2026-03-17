package com.cartalkpro.domain.repair.client;

import com.cartalkpro.domain.repair.dto.RepairResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.net.URI;

@Component
@RequiredArgsConstructor
public class RepairApiClient {

    private final RestTemplate restTemplate;

    @Value("${repair.api.key}")
    private String serviceKey;

    private static final String BASE_URL = "http://api.data.go.kr/openapi/tn_pubr_public_auto_maintenance_company_api";

    public RepairResponseDto fetchRepairShops(String brandKeyword, int pageNo, int numOfRows) {
        // 검색 키워드(현대, 벤츠 등)를 포함하여 URL 조립
        String urlString = BASE_URL + "?serviceKey=" + serviceKey
                + "&pageNo=" + pageNo
                + "&numOfRows=" + numOfRows
                + "&type=json"
                + "&inspofcNm=" + brandKeyword;

        URI uri = URI.create(urlString);

        try {
            return restTemplate.getForObject(uri, RepairResponseDto.class);
        } catch (Exception e) {
            throw new RuntimeException("정비업체 API 호출 중 오류 발생: " + e.getMessage());
        }
    }
}
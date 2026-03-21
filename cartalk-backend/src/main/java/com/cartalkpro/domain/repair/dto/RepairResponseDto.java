package com.cartalkpro.domain.repair.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter; // 1. Setter 추가
import java.util.List;

@Getter
@NoArgsConstructor
public class RepairResponseDto {

    private Response response;

    @Getter
    @NoArgsConstructor
    public static class Response {
        private Body body;
    }

    @Getter
    @NoArgsConstructor
    public static class Body {
        private List<RepairData> items;
        private int totalCount;
    }

    @Getter
    @NoArgsConstructor
    @Setter // 2. 여기에 Setter를 붙여야 서비스 로직에서 계산된 거리를 넣을 수 있습니다.
    public static class RepairData {
        @JsonAlias("inspofcNm")
        private String companyName;

        @JsonAlias("inspofcType")
        private String companyType;

        @JsonAlias("rdnmadr")
        private String roadAddress;

        @JsonAlias("latitude")
        private String latitude;

        @JsonAlias("longitude")
        private String longitude;

        @JsonAlias("phoneNumber")
        private String phoneNumber;

        @JsonAlias("operOpenHm")
        private String openTime;

        @JsonAlias("operCloseHm")
        private String closeTime;

        @JsonAlias("bsnSttus")
        private String businessStatus;

        // ✅ 추가: 사용자로부터의 직선 거리 (단위: km)
        // API 응답에는 없지만 우리가 계산해서 프론트에 보내줄 데이터입니다.
        private Double distance;
    }
}
package com.cartalkpro.domain.repair.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.NoArgsConstructor;
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
    public static class RepairData {
        @JsonAlias("inspofcNm")
        private String companyName;

        @JsonAlias("inspofcType")
        private String companyType; // 01:종합, 02:소형 등

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
        private String businessStatus; // 영업상태
    }
}
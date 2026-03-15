package com.cartalkpro.domain.recall.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 공공데이터 리콜 현황 API 응답을 담기 위한 DTO
 */
@Getter
@NoArgsConstructor
public class RecallResponseDto {

    private int currentCount;
    private int totalCount;
    private List<RecallData> data;

    @Getter
    @NoArgsConstructor
    public static class RecallData {

        // ✅ API JSON은 "제작자"인데 DTO는 "제작사"로 되어 있었어요! "제작자"로 수정합니다.
        // 아 제발 똑같이 좀 받아와라
        // ✅ "제작자" 혹은 "제작사" 둘 다 대응하도록 Alias 추가
        @JsonAlias({"제작자", "제작사"})
        private String manufacturer;

        @JsonAlias("차명")
        private String modelName;

        @JsonAlias("리콜사유")
        private String recallReason;

        @JsonAlias("생산기간(부터)")
        private String productionStartDate;

        @JsonAlias("생산기간(까지)")
        private String productionEndDate;

        @JsonAlias("리콜개시일")
        private String recallStartDate;
    }
}
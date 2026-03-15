package com.cartalkpro.domain.recall.service;

import com.cartalkpro.domain.recall.client.RecallApiClient;
import com.cartalkpro.domain.recall.dto.RecallResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 리콜 데이터 매칭 및 판정을 담당하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecallService {

    private final RecallApiClient recallApiClient;

    /**
     * DB에서 가져온 진짜 차명과 연식을 기반으로 리콜 대상 여부를 확인합니다.
     * @param userCarName 유저의 실제 모델명 (DB 데이터)
     * @param modelYear 유저의 실제 모델 연식 (DB 데이터)
     * @return 매칭된 리콜 정보 리스트
     */
    public List<RecallResponseDto.RecallData> checkRecall(String userCarName, int modelYear) {

        // 1. 공공데이터 API로부터 리콜 목록 수집 (최근 100건)
        RecallResponseDto response = recallApiClient.fetchRecallData(1, 100);

        if (response == null || response.getData() == null) {
            return List.of();
        }

        // 2. 필터링 로직: 진짜 데이터(차명, 연식)와 API 데이터 비교
        return response.getData().stream()
                .filter(data -> isCarNameMatch(data.getModelName(), userCarName))
                .filter(data -> isWithinProductionRange(data, modelYear))
                .collect(Collectors.toList());
    }

    /**
     * 차명이 유사한지 검사 (API의 '아반떼(AD)'에 유저의 '아반떼'가 포함되는지 확인)
     */
    private boolean isCarNameMatch(String apiCarName, String userCarName) {
        if (apiCarName == null || userCarName == null) return false;
        return apiCarName.contains(userCarName) || userCarName.contains(apiCarName);
    }

    /**
     * 유저의 모델 연식이 API의 생산 기간 범위 내에 있는지 검사
     */
    private boolean isWithinProductionRange(RecallResponseDto.RecallData data, int modelYear) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            // API 날짜 데이터 파싱
            LocalDate start = LocalDate.parse(data.getProductionStartDate(), formatter);
            LocalDate end = LocalDate.parse(data.getProductionEndDate(), formatter);

            // 연도 비교 (내 차 연식이 생산 시작 연도와 종료 연도 사이에 있는지 확인)
            int startYear = start.getYear();
            int endYear = end.getYear();

            return modelYear >= startYear && modelYear <= endYear;
        } catch (Exception e) {
            return false;
        }
    }
}
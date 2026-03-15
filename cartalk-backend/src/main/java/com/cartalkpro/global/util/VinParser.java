package com.cartalkpro.global.util;

import java.util.HashMap;
import java.util.Map;

/**
 * 차대번호(VIN) 분석 유틸리티 클래스
 */
public class VinParser {

    private static final Map<Character, Integer> YEAR_MAP = new HashMap<>();

    static {
        // ISO 3779 표준에 따른 10번째 자리 연식 코드 매핑 (2010년 ~ 2039년 사이클)
        YEAR_MAP.put('A', 2010); YEAR_MAP.put('B', 2011); YEAR_MAP.put('C', 2012);
        YEAR_MAP.put('D', 2013); YEAR_MAP.put('E', 2014); YEAR_MAP.put('F', 2015);
        YEAR_MAP.put('G', 2016); YEAR_MAP.put('H', 2017); YEAR_MAP.put('J', 2018);
        YEAR_MAP.put('K', 2019); YEAR_MAP.put('L', 2020); YEAR_MAP.put('M', 2021);
        YEAR_MAP.put('N', 2022); YEAR_MAP.put('P', 2023); YEAR_MAP.put('R', 2024);
        YEAR_MAP.put('S', 2025); YEAR_MAP.put('T', 2026); YEAR_MAP.put('V', 2027);
        YEAR_MAP.put('W', 2028); YEAR_MAP.put('X', 2029); YEAR_MAP.put('Y', 2030);
        YEAR_MAP.put('1', 2031); YEAR_MAP.put('2', 2032); YEAR_MAP.put('3', 2033);
        YEAR_MAP.put('4', 2034); YEAR_MAP.put('5', 2035); YEAR_MAP.put('6', 2036);
        YEAR_MAP.put('7', 2037); YEAR_MAP.put('8', 2038); YEAR_MAP.put('9', 2039);
    }

    /**
     * 차대번호 17자리 중 10번째 자리를 추출하여 모델 연도를 반환합니다.
     * @param vin 17자리 차대번호
     * @return 생산 연도 (4자리 정수), 유효하지 않을 경우 0 반환
     */
    public static int parseModelYear(String vin) {
        if (vin == null || vin.length() != 17) {
            throw new IllegalArgumentException("유효하지 않은 차대번호입니다. 17자리여야 합니다.");
        }

        // 10번째 자리 추출 (인덱스는 9)
        char yearCode = vin.toUpperCase().charAt(9);

        return YEAR_MAP.getOrDefault(yearCode, 0);
    }
}
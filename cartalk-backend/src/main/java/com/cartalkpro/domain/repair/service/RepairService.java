package com.cartalkpro.domain.repair.service;

import com.cartalkpro.domain.repair.client.RepairApiClient;
import com.cartalkpro.domain.repair.dto.RepairResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepairService {

    private final RepairApiClient repairApiClient;

    // 지구 반지름 (단위: km)
    private static final double EARTH_RADIUS = 6371.0;

    /**
     * 브랜드 및 사용자 위치 기반 정비소 조회
     */
    public List<RepairResponseDto.RepairData> getOfficialRepairShops(String userBrand, Double userLat, Double userLng) {
        System.out.println("=== [Backend] 정비소 검색 시작 ===");
        System.out.println("1. 요청 브랜드: " + userBrand + " | 위치: " + userLat + ", " + userLng);

        // 1. 브랜드 키워드 매핑
        String searchKeyword = mapBrandToKeyword(userBrand);
        System.out.println("2. 매핑된 검색 키워드: " + searchKeyword);

        // 2. 공공데이터 API 호출
        RepairResponseDto response = repairApiClient.fetchRepairShops(searchKeyword, 1, 100);

        if (response == null || response.getResponse() == null || response.getResponse().getBody() == null) {
            System.out.println("!!! [Error] 공공 API 응답이 비어있습니다 !!!");
            return List.of();
        }

        List<RepairResponseDto.RepairData> allItems = response.getResponse().getBody().getItems();
        System.out.println("3. API에서 가져온 전체 데이터 개수: " + (allItems != null ? allItems.size() : 0));

        if (allItems == null) return List.of();

        // 3. 필터링 및 거리 계산
        List<RepairResponseDto.RepairData> shops = allItems.stream()
                .filter(shop -> "01".equals(shop.getCompanyType()) || "02".equals(shop.getCompanyType()))
                .filter(shop -> !"폐업".equals(shop.getBusinessStatus()))
                .peek(shop -> {
                    if (userLat != null && userLng != null && shop.getLatitude() != null && shop.getLongitude() != null) {
                        try {
                            double shopLat = Double.parseDouble(shop.getLatitude());
                            double shopLng = Double.parseDouble(shop.getLongitude());
                            double distance = calculateDistance(userLat, userLng, shopLat, shopLng);
                            shop.setDistance(Math.round(distance * 100) / 100.0);
                        } catch (Exception e) {
                            System.out.println("!!! 좌표 변환 실패: " + shop.getCompanyName());
                        }
                    }
                })
                .collect(Collectors.toList());

        System.out.println("4. 필터링(영업중/유형) 후 남은 개수: " + shops.size());

        // 4. 거리순 정렬
        if (userLat != null && userLng != null) {
            shops.sort(Comparator.comparingDouble(s -> s.getDistance() != null ? s.getDistance() : Double.MAX_VALUE));
            System.out.println("5. 거리순 정렬 완료");
        }

        return shops;
    }

    /**
     * Haversine 공식을 이용한 두 지점 간의 직선 거리 계산
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c;
    }

    private String mapBrandToKeyword(String brand) {
        String normalized = brand.toLowerCase().replaceAll("\\s", "");

        // 일단 이거로 하고 그 후에 DB Mapping ㄱㄱ
        return switch (normalized) {
            case "hyundai", "현대" -> "현대자동차";
            case "kia", "기아" -> "기아자동차";
            case "mercedes", "benz", "벤츠" -> "메르세데스";
            case "bmw" -> "BMW";
            default -> brand;
        };
    }
}
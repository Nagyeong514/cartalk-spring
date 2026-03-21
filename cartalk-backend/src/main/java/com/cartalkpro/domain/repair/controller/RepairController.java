package com.cartalkpro.domain.repair.controller;

import com.cartalkpro.domain.repair.dto.RepairResponseDto;
import com.cartalkpro.domain.repair.service.RepairService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/repair")
@RequiredArgsConstructor
public class RepairController {

    private final RepairService repairService;

    /*
     * 사용자 위치 및 브랜드 기반 정비소 조회 API
     * GET /api/repair/nearby?brand=현대&lat=37.5&lng=127.0
     */
    @GetMapping("/nearby")
    public ResponseEntity<List<RepairResponseDto.RepairData>> getNearbyRepairShops(
            @RequestParam String brand,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng
    ) {
        // 💡 수정된 부분: lat과 lng을 함께 넘겨줍니다.
        List<RepairResponseDto.RepairData> repairShops = repairService.getOfficialRepairShops(brand, lat, lng);

        return ResponseEntity.ok(repairShops);
    }
}
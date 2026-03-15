package com.cartalkpro.domain.recall.controller;

import com.cartalkpro.domain.recall.dto.RecallResponseDto;
import com.cartalkpro.domain.recall.service.RecallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recall")
@RequiredArgsConstructor
public class RecallController {

    private final RecallService recallService;

    @GetMapping("/check")
    public ResponseEntity<List<RecallResponseDto.RecallData>> getRecallStatus(
            // ✅ 이름을 명시적으로 지정하여 컴파일러 추론 에러를 방지합니다.
            @RequestParam("carName") String carName,
            @RequestParam("modelYear") int modelYear) {

        List<RecallResponseDto.RecallData> recallResults = recallService.checkRecall(carName, modelYear);

        return ResponseEntity.ok(recallResults);
    }
}
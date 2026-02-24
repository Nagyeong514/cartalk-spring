package com.cartalkpro.domain.vehicle.controller;

import com.cartalkpro.domain.vehicle.entity.Vehicle;
import com.cartalkpro.domain.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cartalkpro.domain.vehicle.dto.VehicleResponseDto;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vehicle")
public class VehicleController {

    private final VehicleRepository vehicleRepository;

    @GetMapping("/my")
    public ResponseEntity<?> getMyVehicle() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return vehicleRepository.findByMemberEmail(email)
                .map(vehicle -> ResponseEntity.ok(new VehicleResponseDto(vehicle))) // ✅ DTO로 변환해서 반환!
                .orElse(ResponseEntity.notFound().build());
    }
}
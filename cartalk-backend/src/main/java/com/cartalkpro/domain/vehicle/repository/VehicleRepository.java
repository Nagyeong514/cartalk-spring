package com.cartalkpro.domain.vehicle.repository;

import com.cartalkpro.domain.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // ✅ 로그인한 사용자의 이메일로 차량 정보를 찾아오는 쿼리 메서드
    Optional<Vehicle> findByMemberEmail(String email);
}
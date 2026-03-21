package com.cartalkpro.domain.vehicle.dto;

import com.cartalkpro.domain.vehicle.entity.Vehicle;
import lombok.Getter;

@Getter
public class VehicleResponseDto {
    private String manufacturer; // 추가: 제조사
    private String modelName;
    private Integer modelYear;
    private String vin;
    private Integer mileage;

    public VehicleResponseDto(Vehicle vehicle) {
        this.manufacturer = vehicle.getManufacturer(); // 엔티티에서 가져오기
        this.modelName = vehicle.getModelName();
        this.modelYear = vehicle.getModelYear();
        this.vin = vehicle.getVin();
        this.mileage = vehicle.getMileage();
    }
}
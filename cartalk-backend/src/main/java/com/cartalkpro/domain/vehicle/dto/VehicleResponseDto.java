package com.cartalkpro.domain.vehicle.dto;

import com.cartalkpro.domain.vehicle.entity.Vehicle;
import lombok.Getter;

@Getter
public class VehicleResponseDto {
    private String modelName;
    private Integer modelYear;
    private String vin;
    private Integer mileage;

    public VehicleResponseDto(Vehicle vehicle) {
        this.modelName = vehicle.getModelName();
        this.modelYear = vehicle.getModelYear();
        this.vin = vehicle.getVin();
        this.mileage = vehicle.getMileage();
    }
}
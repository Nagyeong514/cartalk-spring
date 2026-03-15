import apiClient from "../apiClient";

export interface VehicleResponse {
  modelName: string;
  modelYear: number;
  vin: string;
  mileage: number;
}

export const getMyVehicle = async (): Promise<VehicleResponse> => {
  const response = await apiClient.get<VehicleResponse>("/api/vehicle/my");
  return response.data;
};
import apiClient from '../apiClient';

export interface RecallData {
  manufacturer: string;
  modelName: string;
  recallReason: string;
  productionStartDate: string;
  productionEndDate: string;
  recallStartDate: string;
}

export const checkRecallStatus = async (carName: string, modelYear: number): Promise<RecallData[]> => {
  const response = await apiClient.get<RecallData[]>("/api/recall/check", {
    params: { carName, modelYear },
  });
  return response.data;
};
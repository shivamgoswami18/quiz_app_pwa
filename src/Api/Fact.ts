import { ADD_FACT, EDIT_FACT, FACT_LIST, VIEW_FACT } from "./ApiRoutes";
import { authData } from "./ApiService";

export const factListApi = async (data?: any) => {
  const response = await authData.post(FACT_LIST, data);
  return response?.data;
};

export const addFactApi = async (data: any) => {
  const response = await authData.post(ADD_FACT, data);
  return response?.data;
};

export const viewFactApi = async (id: string) => {
  const response = await authData.get(`${VIEW_FACT}${id}`);
  return response?.data;
};

export const editFactApi = async (data: any, id: string) => {
  const response = await authData.put(`${EDIT_FACT}${id}`, data);
  return response?.data;
};

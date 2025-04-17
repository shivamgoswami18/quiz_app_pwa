import {
  EDIT_USER_STATUS,
  LIST_OF_USER_PERFORMANCE,
  LIST_OF_USER_STATS,
  USER_LIST,
  VIEW_USER,
} from "./ApiRoutes";
import { authData } from "./ApiService";

export const userListApi = async (data?: any) => {
  const response = await authData.post(USER_LIST, data);
  return response?.data;
};

export const editUserStatusApi = async (id: string) => {
  const response = await authData.put(`${EDIT_USER_STATUS}${id}`);
  return response?.data;
};

export const viewUserApi = async (id: string) => {
  const response = await authData.get(`${VIEW_USER}${id}`);
  return response?.data;
};

export const listOfUserStatsApi = async (id: string) => {
  const response = await authData.get(`${LIST_OF_USER_STATS}${id}`);
  return response?.data;
};

export const listOfUserPerformanceApi = async (id: string, data?: any) => {
  const response = await authData.post(`${LIST_OF_USER_PERFORMANCE}${id}`, data);
  return response?.data;
};

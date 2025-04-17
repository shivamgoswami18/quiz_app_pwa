import {
  ADD_COMMUNITY,
  COMMUNITY_LIST,
  USER_LIST_IN_COMMUNITY,
  EDIT_COMMUNITY,
  EDIT_COMMUNITY_STATUS,
  VIEW_COMMUNITY,
  REMOVE_USER_FROM_COMMUNITY,
} from "./ApiRoutes";
import { authData } from "./ApiService";

export const communityListApi = async (data: any) => {
  const response = await authData.post(COMMUNITY_LIST, data);
  return response?.data;
};

export const addCommunityApi = async (data: any) => {
  const response = await authData.post(ADD_COMMUNITY, data);
  return response?.data;
};

export const viewCommunityApi = async (id: string) => {
  const response = await authData.get(`${VIEW_COMMUNITY}${id}`);
  return response?.data;
};

export const editCommunityApi = async (id: string, data: any) => {
  const response = await authData.put(`${EDIT_COMMUNITY}${id}`, data);
  return response?.data;
};

export const editCommunityStatusApi = async (id: string) => {
  const response = await authData.put(`${EDIT_COMMUNITY_STATUS}${id}`);
  return response?.data;
};

export const userListInCommunityApi = async (id: string, data?: any) => {
  const response = await authData.post(`${USER_LIST_IN_COMMUNITY}${id}`, data);
  return response.data;
};

export const removeUserFromCommunityApi = async (id: string, data: any) => {
  const response = await authData.delete(`${REMOVE_USER_FROM_COMMUNITY}${id}`, {data});
  return response.data;
};

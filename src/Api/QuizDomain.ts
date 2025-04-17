import {
  ADD_DOMAIN,
  DELETE_DOMAIN,
  DOMAIN_LIST,
  EDIT_DOMAIN,
  VIEW_DOMAIN,
} from "./ApiRoutes";
import { authData } from "./ApiService";

export const domainListApi = async (data: any = {}) => {
  const response = await authData.post(DOMAIN_LIST, data);
  return response?.data;
};

export const addDomainApi = async (data: any) => {
  const response = await authData.post(ADD_DOMAIN, data);
  return response?.data;
};

export const viewDomainApi = async (id: string) => {
  const response = await authData.get(`${VIEW_DOMAIN}${id}`);
  return response?.data;
};

export const editDomainApi = async (id: string, data: any) => {
  const response = await authData.put(`${EDIT_DOMAIN}${id}`, data);
  return response?.data;
};

export const deleteDomainApi = async (id: string) => {
  const response = await authData.delete(`${DELETE_DOMAIN}${id}`);
  return response?.data;
};
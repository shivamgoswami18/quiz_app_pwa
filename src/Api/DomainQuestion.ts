import {
  ADD_DOMAIN_QUESTION,
  DELETE_DOMAIN_QUESTION,
  DOMAIN_QUESTION_LIST,
  EDIT_DOMAIN_QUESTION,
  VIEW_DOMAIN_QUESTION,
} from "./ApiRoutes";
import { authData } from "./ApiService";

export const domainWiseQuestionListApi = async (id: string, data?: any) => {
  const response = await authData.post(`${DOMAIN_QUESTION_LIST}${id}`, data);
  return response?.data;
};

export const addDomainQuestionApi = async (data: any) => {
  const response = await authData.post(ADD_DOMAIN_QUESTION, data);
  return response?.data;
};

export const editDomainQuestionApi = async (id: string, data: any) => {
  const response = await authData.put(`${EDIT_DOMAIN_QUESTION}${id}`, data);
  return response?.data;
};

export const deleteDomainQuestionApi = async (id: string) => {
  const response = await authData.delete(`${DELETE_DOMAIN_QUESTION}${id}`);
  return response?.data;
};

export const viewDomainQuestionApi = async (id: string) => {
  const response = await authData.get(`${VIEW_DOMAIN_QUESTION}${id}`);
  return response?.data;
};
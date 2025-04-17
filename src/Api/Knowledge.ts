import {
  ARTICLE_ADD,
  ARTICLE_DELETE,
  ARTICLE_EDIT,
  ARTICLE_LIST,
  ARTICLE_VIEW,
  EDIT_ARTICLE_STATUS,
} from "./ApiRoutes";
import { authData } from "./ApiService";

export const articleListApi = async (data?: any) => {
  const response = await authData.post(ARTICLE_LIST, data);
  return response?.data;
};

export const articleAddApi = async (data: any) => {
  const response = await authData.post(ARTICLE_ADD, data);
  return response?.data;
};

export const articleViewApi = async (id: string) => {
  const response = await authData.get(`${ARTICLE_VIEW}${id}`);
  return response?.data;
};

export const articleEditApi = async (id: string, data: any) => {
  const response = await authData.put(`${ARTICLE_EDIT}${id}`, data);
  return response?.data;
};

export const editArticleStatusApi = async (id: string) => {
  const response = await authData.put(`${EDIT_ARTICLE_STATUS}${id}`);
  return response?.data;
};

export const deleteArticleStatusApi = async (id: string) => {
  const response = await authData.delete(`${ARTICLE_DELETE}${id}`);
  return response?.data;
};
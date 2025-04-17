import {
  ADD_QUIZ_DETAILS,
  ADD_QUIZ_QUESTION,
  APPROVE_QUIZ,
  DELETE_BONUS_QUESTION,
  EDIT_BONUS_QUESTION,
  EDIT_QUIZ_DETAILS,
  EDIT_QUIZ_STATUS,
  QUIZ_LIST,
  QUIZ_QUESTION_LIST,
  QUIZ_QUESTION_LIST_WITH_SELECTION,
  REJECT_QUIZ,
  UPDATE_QUIZ_QUESTION,
  VIEW_BONUS_QUESTION,
  VIEW_QUIZ_DETAILS,
} from "./ApiRoutes";
import { authData } from "./ApiService";

export const quizListApi = async (hasFeedback: string, data?: any) => {
  const response = await authData.post(QUIZ_LIST, data, {
    params: { hasFeedback },
  });
  return response?.data;
};

export const quizQuestionListWithSelectionApi = async (data: any) => {
  const response = await authData.post(QUIZ_QUESTION_LIST_WITH_SELECTION, data);
  return response?.data;
};

export const updateQuizQuestionsAPi = async (data: any) => {
  const response = await authData.post(UPDATE_QUIZ_QUESTION, data);
  return response?.data;
};

export const editQuizStatusApi = async (id: string) => {
  const response = await authData.put(`${EDIT_QUIZ_STATUS}${id}`);
  return response?.data;
};

export const addQuizDetailsApi = async (data: any) => {
  const response = await authData.post(ADD_QUIZ_DETAILS, data);
  return response?.data;
};

export const viewQuizDetailsApi = async (id: string) => {
  const response = await authData.get(`${VIEW_QUIZ_DETAILS}${id}`);
  return response?.data;
};

export const editQuizDetailsApi = async (id: string, data: any) => {
  const response = await authData.put(`${EDIT_QUIZ_DETAILS}${id}`, data);
  return response?.data;
};

export const updateQuizQuestionApi = async (data: any) => {
  const response = await authData.put(UPDATE_QUIZ_QUESTION, data);
  return response?.data;
};

export const quizQuestionListApi = async (id: string, data?: any) => {
  const response = await authData.post(`${QUIZ_QUESTION_LIST}${id}`, data);
  return response?.data;
};

export const addBonusQuestionApi = async (data: any) => {
  const response = await authData.post(ADD_QUIZ_QUESTION, data);
  return response?.data;
};

export const viewBonusQuestionApi = async (id: string) => {
  const response = await authData.get(`${VIEW_BONUS_QUESTION}${id}`);
  return response?.data;
};

export const editBonusQuestionApi = async (data: any, id: string) => {
  const response = await authData.put(`${EDIT_BONUS_QUESTION}${id}`, data);
  return response?.data;
};

export const deleteBonusQuestionApi = async (id: string) => {
  const response = await authData.delete(`${DELETE_BONUS_QUESTION}${id}`);
  return response?.data;
};

export const approveQuizApi = async (id: string, data: any) => {
  const response = await authData.put(`${APPROVE_QUIZ}${id}`, data);
  return response?.data;
};

export const rejectQuizApi = async (id: string, data: any) => {
  const response = await authData.put(`${REJECT_QUIZ}${id}`, data);
  return response?.data;
};

import { FEEDBACK_LIST, QUIZ_FEEDBACK_LIST } from "./ApiRoutes";
import { authData } from "./ApiService";

export const feedbackListApi = async (hasFeedback: string, data?: any) => {
  const response = await authData.post(FEEDBACK_LIST, data, {
    params: { hasFeedback },
  });
  return response?.data;
};

export const quizFeedbackListApi = async (id: string, data?: any) => {
  const response = await authData.post(`${QUIZ_FEEDBACK_LIST}${id}`, data);
  return response?.data;
};
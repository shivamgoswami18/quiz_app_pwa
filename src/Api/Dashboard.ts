import {
  DASHBOARD_FEEDBACK_TRENDS_DATA,
  DASHBOARD_QUIZ_DATA,
  DASHBOARD_QUIZ_STATISTICS_DATA,
  DASHBOARD_TOP_PERFORMERS_DATA,
} from "./ApiRoutes";
import { authData } from "./ApiService";

export const dashboardQuizDataApi = async () => {
  const response = await authData.get(DASHBOARD_QUIZ_DATA);
  return response.data;
};

export const dashboardQuizStatisticsDataApi = async () => {
  const response = await authData.get(DASHBOARD_QUIZ_STATISTICS_DATA);
  return response.data;
};

export const dashboardTopPerformersDataApi = async () => {
  const response = await authData.get(DASHBOARD_TOP_PERFORMERS_DATA);
  return response.data;
};

export const dashboardFeedbackTrendsDataApi = async () => {
  const response = await authData.get(DASHBOARD_FEEDBACK_TRENDS_DATA);
  return response.data;
};

import { DOMAIN_LEADERBOARD_LIST, GLOBAL_LEADERBOARD_LIST } from "./ApiRoutes";
import { authData } from "./ApiService";

export const globalLeaderboardListApi = async (id: string, data: any) => {
  const response = await authData.post(`${GLOBAL_LEADERBOARD_LIST}${id}`, data);
  return response?.data;
};

export const domainLeaderboardListApi = async (id: string, data: any) => {
  const response = await authData.post(`${DOMAIN_LEADERBOARD_LIST}${id}`, data);
  return response?.data;
};

import {
  ADD_TOURNAMENT,
  EDIT_TOURNAMENT,
  EDIT_TOURNAMENT_STATUS,
  TOURNAMENT_DOMAIN_QUIZ_LIST,
  TOURNAMENT_LIST,
  TOURNAMENT_SELECTED_QUIZZES_LIST,
  UPDATE_TOURNAMENT_QUIZ_LIST,
  VIEW_TOURNAMENT,
} from "./ApiRoutes";
import { authData } from "./ApiService";

export const tournamentSelctedQuizzesListApi = async (id: string, data: any) => {
  const response = await authData.post(`${TOURNAMENT_SELECTED_QUIZZES_LIST}${id}`, data);
  return response?.data;
};

export const tournamentListApi = async (data: any) => {
  const response = await authData.post(TOURNAMENT_LIST, data);
  return response?.data;
};

export const addTournamentApi = async (data: any) => {
  const response = await authData.post(ADD_TOURNAMENT, data);
  return response?.data;
};

export const viewTournamentApi = async (id: string) => {
  const response = await authData.get(`${VIEW_TOURNAMENT}${id}`);
  return response?.data;
};

export const editTournamentApi = async (id: string, data: any) => {
  const response = await authData.put(`${EDIT_TOURNAMENT}${id}`, data);
  return response?.data;
};

export const listOfTournamentDomainQuizApi = async (data: any) => {
  const response = await authData.post(TOURNAMENT_DOMAIN_QUIZ_LIST, data);
  return response?.data;
};

export const editListOfTournamentQuizApi = async (data: any) => {
  const response = await authData.put(UPDATE_TOURNAMENT_QUIZ_LIST, data);
  return response?.data;
};

export const editTournamentStatusApi = async (id: string) => {
  const response = await authData.put(`${EDIT_TOURNAMENT_STATUS}${id}`);
  return response?.data;
};

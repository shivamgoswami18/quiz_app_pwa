import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { removeItem } from "Components/constants/common";
import { StatusCodes } from "http-status-codes";

export const baseURL = process.env.REACT_APP_BASEURL as string;
export const BaseImageURL = process.env.REACT_APP_BASEIMAGEURL as string;

const handleUnauthorizedError = (instance: any) => {
  instance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error?.response?.status === StatusCodes.UNAUTHORIZED) {
        removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(new Error(error?.message));
    }
  );
};

export const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const Bearer = "Bearer";
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (config && config.headers) {
        const authToken = sessionStorage.getItem("token");
        if (authToken) {
          config.headers["Authorization"] = `${Bearer} ${authToken}`;
        }
      }
      return config;
    }
  );
  handleUnauthorizedError(instance);
  return instance;
};

export const createNonAuthAxiosInstance = (
  baseURL: string,
  contentType: string = "application/json"
): AxiosInstance => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": contentType,
    },
  });
};

export const createAuthAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (config && config.headers) {
        const authToken = sessionStorage.getItem("token");
        if (authToken) {
          config.headers["Authorization"] = `Bearer ${authToken}`;
        }
      }
      return config;
    }
  );
  handleUnauthorizedError(instance);
  return instance;
};

export const authData = createAxiosInstance(baseURL);
export const nonAuthData = createNonAuthAxiosInstance(baseURL);
export const multipartData = createNonAuthAxiosInstance(
  baseURL,
  "multipart/form-data"
);
export const multipartDataWithToken = createAuthAxiosInstance(baseURL);

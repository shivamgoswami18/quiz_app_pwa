import { CHANGEPASSWORD, EDITPROFILE, FILEUPLOAD, LOGIN, VIEWPROFILE } from "./ApiRoutes";
import { authData, multipartDataWithToken, nonAuthData } from "./ApiService";

export const loginApi = async (formData: any) => {
  const response = await nonAuthData.post(LOGIN, formData);
  return response.data;
};

export const changePasswordApi = async (formData: any) => {
  const response = await authData.put(CHANGEPASSWORD, formData);
  return response.data;
};

export const viewProfileApi = async () => {
  const response = await authData.get(VIEWPROFILE);
  return response.data;
};

export const editProfileApi = async (formData: any) => {
  const response = await authData.put(EDITPROFILE, formData);
  return response.data;
};

export const fileUploadApi = async (formData: any) => {
  const response = await multipartDataWithToken.post(FILEUPLOAD, formData);
  return response.data;
};
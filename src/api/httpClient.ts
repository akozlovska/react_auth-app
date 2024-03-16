import { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { createClient } from "./client";
import * as authService from '../api/services/authService';

export const httpClient = createClient();

httpClient.interceptors.request.use(onRequest);
httpClient.interceptors.response.use(onResponseSuccess, onResponseError);

function onRequest(req: InternalAxiosRequestConfig) {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    req.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return req;
}

function onResponseSuccess(res: AxiosResponse) {
  return res.data;
}

async function onResponseError(error: AxiosError) {
  const originalRequest = error.config as AxiosRequestConfig;
  const { status } = error.response as AxiosResponse ?? {};

  if (status !== 401) {
    throw error;
  }

  try {
    const { accessToken } = await authService.refresh();
    localStorage.setItem('accessToken', accessToken);

    return httpClient.request(originalRequest);
  } catch (error) {
    throw error;
  }
}



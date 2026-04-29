import axios from 'axios';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://k8s.mectest.ru/test-app';

export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws').replace(
  /\/$/,
  '',
);

type TokenGetter = () => string | null;

let getToken: TokenGetter = () => null;

export const setTokenGetter = (getter: TokenGetter) => {
  getToken = getter;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

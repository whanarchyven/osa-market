import axios, { InternalAxiosRequestConfig } from 'axios';
import { baseAxiosHeaders } from './prepareHeaders';

const API_URL = process.env.NEXT_PUBLIC_FRONT_API_URL;
const PROXY_API_URL = process.env.NEXT_PUBLIC_FRONT_PROXY_API_URL;
const CONTENT_PROXY_API_URL =
  process.env.NEXT_PUBLIC_FRONT_CONTENT_PROXY_API_URL;

export const axiosInstance = axios.create({
  headers: baseAxiosHeaders,
  withCredentials: true,
  baseURL: typeof window === 'undefined' ? API_URL : PROXY_API_URL,
  timeout: 30000, // 30 секунд таймаут для запросов
});

export const axiosContent = axios.create({
  headers: baseAxiosHeaders,
  withCredentials: true,
  baseURL: typeof window === 'undefined' ? API_URL : CONTENT_PROXY_API_URL,
  timeout: 30000, // 30 секунд таймаут для запросов
});

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    config.headers['Authorization-Token'] = token;
  }

  return config;
};

axiosInstance.interceptors.request.use(authRequestInterceptor);
axiosContent.interceptors.request.use(authRequestInterceptor);

import { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { apiClient } from './api-client';

/**
 * Interceptor de Request - Adiciona token JWT ao header Authorization
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('[AuthInterceptor] Attaching token:', token.substring(0, 10) + '...');
    } else {
      console.warn('[AuthInterceptor] No token found in localStorage');
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response - Trata erros de autenticação (401)
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Disparar evento customizado para que a aplicação (App.tsx) trate o logout via store
      // Isso evita dependência circular entre interceptor <-> store
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;

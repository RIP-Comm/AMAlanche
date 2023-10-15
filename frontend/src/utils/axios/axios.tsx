import { API_BASE_URL } from '../Env';
import axios from 'axios';

export const axiosCommonResponseInterceptor = (response: any) => response;

export const axiosCommonErrorInterceptor = (error: any) => {
	console.error('An error occurred during the request:', error);
	return Promise.reject(error);
};

export const axiosInstance = axios.create({
	baseURL: `${API_BASE_URL}/api`,
});

axiosInstance.interceptors.response.use(
	axiosCommonResponseInterceptor,
	axiosCommonErrorInterceptor,
);

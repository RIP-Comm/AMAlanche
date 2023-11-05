import { API_BASE_URL } from '../Env';
import axios from 'axios';
import store from '../redux/Store';
import { AuthGoogleResponse } from '../types/Auth.types';

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

axiosInstance.interceptors.request.use(
	(config) => {
		const accessToken = store.getState().auth.accessToken;
		if (accessToken) {
			if (localStorage.getItem('AuthType') === 'google') {
				setAxsiosHeader(accessToken);
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export const setAxsiosHeader = (data: AuthGoogleResponse | string) => {
	axiosInstance.defaults.headers.common['AuthType'] = 'google';
	if (typeof data === 'string') {
		axiosInstance.defaults.headers.common['Authorization'] = `Bearer ` + data;
	} else {
		axiosInstance.defaults.headers.common['Authorization'] = `Bearer ` + data.accessToken;
	}
};

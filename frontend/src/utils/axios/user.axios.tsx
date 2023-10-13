import axios from 'axios';
import { SOCKET_URL } from '../Env';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosCommonErrorInterceptor, axiosCommonResponseInterceptor } from './axios';

const instance = axios.create({
	baseURL: SOCKET_URL + '/api/user',
});

instance.interceptors.response.use(axiosCommonResponseInterceptor, axiosCommonErrorInterceptor);

export const getUser = createAsyncThunk('user/getUser', async (userId: string) => {
	try {
		const response = await instance.get(`/${userId}`);
		const user = response.data;
		return user;
	} catch (error) {
		throw error;
	}
});

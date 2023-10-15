import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from './axios';
import { UpdateUserRequest } from '../types/User.types';

const userBasePath = '/user';

export const getUser = createAsyncThunk('user/getUser', async (userId: string) => {
	try {
		const response = await axiosInstance.get(`${userBasePath}/${userId}`);
		const user = response.data;
		return user;
	} catch (error) {
		throw error;
	}
});

export const putUser = createAsyncThunk('user/putUser', async (updatedUser: UpdateUserRequest) => {
	try {
		const response = await axiosInstance.put(`${userBasePath}/${updatedUser.id}`, updatedUser);
		const user = response.data;
		return user;
	} catch (error) {
		throw error;
	}
});

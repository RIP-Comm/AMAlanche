import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from './Axios';
import { UpdateUserRequest } from '../types/User.types';

export const userBasePath = '/users';

export const getUser = createAsyncThunk('users/getUsers', async (userId: string) => {
	try {
		const response = await axiosInstance.get(`${userBasePath}/${userId}`);
		const user = response.data;
		return user;
	} catch (error) {
		throw error;
	}
});

export const putUser = createAsyncThunk(
	'users/putUsers',
	async (updatedUser: UpdateUserRequest) => {
		try {
			const response = await axiosInstance.put(`${userBasePath}/${updatedUser.id}`, updatedUser);
			const user = response.data;
			return user;
		} catch (error) {
			throw error;
		}
	},
);

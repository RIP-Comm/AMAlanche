import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUserChannels } from './Channel.axios';
import { axiosInstance } from '../../axios/Axios';
import { UpdateUserRequest } from '../../types/User.types';

export const userBasePath = '/users';

export const getUser = createAsyncThunk('users/getUsers', async (userId: string, thunkAPI) => {
	try {
		const response = await axiosInstance.get(`${userBasePath}/${userId}`);
		const user = response.data;
		return thunkAPI.fulfillWithValue(user);
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.response);
	}
});

export const putUser = createAsyncThunk(
	'users/putUsers',
	async (updatedUser: UpdateUserRequest, thunkAPI) => {
		try {
			const response = await axiosInstance.put(`${userBasePath}/${updatedUser.id}`, updatedUser);
			const user = response.data;
			return thunkAPI.fulfillWithValue(user);
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.response);
		}
	},
);

export const refreshAllUserData = createAsyncThunk('users/refresh', async (_, thunkAPI) => {
	try {
		const userId = localStorage.getItem('userId') || '0';
		thunkAPI.dispatch(getUser(userId));
		thunkAPI.dispatch(getAllUserChannels());
		return thunkAPI.fulfillWithValue('ok');
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error.response);
	}
});

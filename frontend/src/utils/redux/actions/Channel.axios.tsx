import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axios/Axios';
import { CreateChannel } from '../../types/Channel.types';
import { userBasePath } from './User.actions';

export const channelBasePath = '/channels';

export const buildChannelBasePath = (userId: string) => {
	return userBasePath + '/' + userId + channelBasePath;
};

export const getAllUserChannels = createAsyncThunk(
	'users/:userId/channels/all',
	async (_, thunkAPI) => {
		try {
			const userId = localStorage.getItem('userId') || '0';
			const response = await axiosInstance.get(`${buildChannelBasePath(userId)}/all`);
			const channels = response.data;
			return thunkAPI.fulfillWithValue(channels);
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.response);
		}
	},
);

export const getChannelById = createAsyncThunk(
	'users/:userId/channels/:channelId',
	async (channelId: string, thunkAPI) => {
		try {
			const userId = localStorage.getItem('userId') || '0';
			const response = await axiosInstance.get(`${buildChannelBasePath(userId)}/${channelId}`);
			const channels = response.data;
			return thunkAPI.fulfillWithValue(channels);
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.response);
		}
	},
);

export const createChannels = createAsyncThunk(
	'users/:userId/channels',
	async (newChannel: CreateChannel, thunkAPI) => {
		try {
			const userId = localStorage.getItem('userId') || '0';
			const response = await axiosInstance.post(`${buildChannelBasePath(userId)}`, newChannel);
			const channel = response.data;
			return thunkAPI.fulfillWithValue(channel);
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.response);
		}
	},
);

export const joinChannels = createAsyncThunk(
	'users/:userId/channels/:channelId/join',
	async (channelId: string, thunkAPI) => {
		try {
			const userId = localStorage.getItem('userId') || '0';
			const response = await axiosInstance.patch(
				`${buildChannelBasePath(userId)}/${channelId}/join`,
			);
			const channel = response.data;
			return thunkAPI.fulfillWithValue(channel);
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.response);
		}
	},
);

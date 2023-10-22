import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from './Axios';
import { userBasePath } from './User.axios';
import { CreateChannel } from '../types/Channel.types';
import store from '../redux/Store';

const channelBasePath = '/channels';

const buildBasePath = (userId: string) => {
	return userBasePath + '/' + userId + channelBasePath;
};

export const getAllUserChannels = createAsyncThunk(
	'users/:userId/channels/all',
	async (userId: string) => {
		try {
			const response = await axiosInstance.get(`${buildBasePath(userId)}/all`);
			const channels = response.data;
			return channels;
		} catch (error) {
			throw error;
		}
	},
);

export const createAllUserChannels = createAsyncThunk(
	'users/:userId/channels',
	async (newChannel: CreateChannel) => {
		try {
			const response = await axiosInstance.post(
				`${buildBasePath(store.getState().user?.id || '0')}`,
				newChannel,
			);
			const channel = response.data;
			return channel;
		} catch (error) {
			throw error;
		}
	},
);

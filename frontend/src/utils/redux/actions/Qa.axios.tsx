import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../axios/Axios';
import store from '../Store';
import { buildChannelBasePath, getChannelById } from './Channel.axios';
import { CreateQA } from '../../types/Qa.types';

const qaBasePath = '/qas';

const buildQaBasePath = (userId: string, channelId: string) => {
	return `${buildChannelBasePath(userId)}/${channelId}${qaBasePath}`;
};

export const createQa = createAsyncThunk(
	'users/:userId/channels/:channelId/qa',
	async (newQa: CreateQA, thunkAPI) => {
		try {
			const response = await axiosInstance.post(
				`${buildQaBasePath(store.getState().user?.id || '0', newQa.channelId)}`,
				newQa,
			);
			const qa = response.data;
			thunkAPI.dispatch(getChannelById(qa.channelId));
			return thunkAPI.fulfillWithValue(qa);
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error.response);
		}
	},
);

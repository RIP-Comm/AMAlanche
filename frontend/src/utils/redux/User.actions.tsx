import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUser } from '../axios/User.axios';
import { getAllUserChannels } from '../axios/User.channel.axios';

export const refreshAllUserData = createAsyncThunk(
	'users/refresh',
	async (userId: string, { dispatch }) => {
		try {
			dispatch(getUser(userId));
			dispatch(getAllUserChannels(userId));
		} catch (error) {
			throw error;
		}
	},
);

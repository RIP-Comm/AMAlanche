import { AxiosResponse } from 'axios';
import {
	AuthGoogleLoginRequest,
	AuthGoogleRefreshRequest,
	AuthGoogleResponse,
} from '../types/Auth.types';
import store from '../redux/Store';
import { logIn, logOut } from '../redux/Actions';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from './Axios';
import { refreshAllUserData } from '../redux/User.actions';

const authBasePath = '/auth';

export const googleLogIn = createAsyncThunk(
	'auth/google/login',
	async (code: string, { dispatch }) => {
		const request: AuthGoogleLoginRequest = { code };
		const response: AxiosResponse<AuthGoogleResponse> = await axiosInstance.post(
			`${authBasePath}/google/login`,
			request,
		);

		dispatch(logIn(response.data));
		dispatch(refreshAllUserData(response.data.userId));
	},
);

export const googleRefresh = createAsyncThunk('auth/google/refresh', async (Void, { dispatch }) => {
	const refreshToken: string | null = localStorage.getItem('refreshToken');

	if (refreshToken === null) {
		console.error('Refresh token not found in localStorage');
	} else {
		const request: AuthGoogleRefreshRequest = { refreshToken: refreshToken };
		const url = `${authBasePath}/google/refresh`;
		const response: void | AuthGoogleResponse = await axiosInstance
			.post(url, request)
			.then((response: AxiosResponse<AuthGoogleResponse>) => {
				store.dispatch(logIn(response.data));
				return response.data;
			})
			.catch((err: any) => {
				console.error('Error in obtaining access token via refresh token, logOut...', err);
				store.dispatch(logOut());
			});

		if (response) {
			dispatch(logIn(response));

			const userId = localStorage.getItem('userId');
			if (userId) {
				dispatch(refreshAllUserData(userId));
			} else {
				console.error('UserId not found in localstorage');
			}
		}
	}
});

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	AuthGoogleLoginRequest,
	AuthGoogleRefreshRequest,
	AuthGoogleResponse,
} from '../../types/Auth.types';
import { AxiosResponse } from 'axios/index';
import { axiosInstance } from '../../axios/Axios';
import { logIn, logOut } from './Actions';
import { refreshAllUserData } from './User.actions';
import store from '../Store';

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
		dispatch(refreshAllUserData());
	},
);

export const googleRefresh = createAsyncThunk('auth/google/refresh', async (_, { dispatch }) => {
	const refreshToken: string | null = localStorage.getItem('RefreshToken');

	if (refreshToken === null) {
		console.error('Refresh token not found in localStorage');
	} else {
		const request: AuthGoogleRefreshRequest = { refreshToken: refreshToken };
		const url = `${authBasePath}/google/refresh`;
		await axiosInstance
			.post(url, request)
			.then((response: AxiosResponse<AuthGoogleResponse>) => {
				if (response.data) {
					store.dispatch(logIn(response.data));
					const userId = localStorage.getItem('userId');
					if (userId) {
						dispatch(refreshAllUserData());
					} else {
						console.error('UserId not found in localstorage');
					}
				}

				return response.data;
			})
			.catch((err: any) => {
				console.error('Error in obtaining access token via refresh token, logOut...', err);
				store.dispatch(logOut());
			});
	}
});

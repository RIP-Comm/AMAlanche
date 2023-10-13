import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthGoogleResponse } from '../types/Auth.types';
import { getUser } from '../axios/user.axios';
import { User } from '../types/User.types';
import { googleRefresh, googleLogIn } from '../axios/auth.axios';

export const dataSlice = createSlice({
	name: 'appStorage',
	initialState: {
		auth: {
			isLogged: false,
			accessToken: '',
			expiry: '',
		},
		user: {},
		isLoading: false,
	},
	reducers: {
		logIn: (state, action: PayloadAction<AuthGoogleResponse>) => {
			action.payload.userId && localStorage.setItem('userId', action.payload.userId);
			localStorage.setItem('refreshToken', action.payload.refreshToken);
			localStorage.setItem('loginType', 'google');
			return {
				...state,
				auth: {
					isLogged: true,
					accessToken: action.payload.accessToken,
					expiry: action.payload.expiry,
				},
			};
		},
		logOut: (state) => {
			localStorage.clear();
			window.location.href = '/';
			return {
				...state,
				auth: {
					isLogged: false,
					accessToken: '',
					expiry: '',
				},
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(googleLogIn.pending, (state) => {
				return {
					...state,
					isLoading: true,
				};
			})
			.addCase(googleLogIn.fulfilled, (state) => {
				return {
					...state,
					isLoading: false,
				};
			})
			.addCase(googleRefresh.pending, (state) => {
				return {
					...state,
					isLoading: true,
				};
			})
			.addCase(googleRefresh.fulfilled, (state) => {
				return {
					...state,
					isLoading: false,
				};
			})
			.addCase(getUser.pending, (state) => {
				return {
					...state,
					isLoading: true,
				};
			})
			.addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
				return {
					...state,
					user: action.payload,
					isLoading: false,
				};
			});
	},
});

export const { logIn, logOut } = dataSlice.actions;

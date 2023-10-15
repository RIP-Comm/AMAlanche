import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthGoogleResponse } from '../types/Auth.types';
import { getUser, putUser } from '../axios/user.axios';
import { User } from '../types/User.types';
import { googleLogIn, googleRefresh } from '../axios/auth.axios';
import { axiosInstance } from '../axios/axios';

export interface AuthState {
	isAuthenticated: boolean;
	accessToken: string;
	expiry: string;
}

export interface AppState {
	auth: AuthState;
	user: User | null;
	isLoading: boolean;
}

const initialState: AppState = {
	auth: {
		isAuthenticated: false,
		accessToken: '',
		expiry: '',
	},
	user: null,
	isLoading: false,
};

export const dataSlice = createSlice({
	name: 'appStorage',
	initialState,
	reducers: {
		logIn: (state, action: PayloadAction<AuthGoogleResponse>) => {
			action.payload.userId && localStorage.setItem('userId', action.payload.userId);
			localStorage.setItem('refreshToken', action.payload.refreshToken);
			localStorage.setItem('authType', 'google');
			axiosInstance.defaults.headers.common['AuthType'] = 'google';
			axiosInstance.defaults.headers.common['Authorization'] =
				`Bearer ` + action.payload.accessToken;

			return {
				...state,
				auth: {
					isAuthenticated: true,
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
					isAuthenticated: false,
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
			})
			.addCase(putUser.pending, (state) => {
				return {
					...state,
					isLoading: true,
				};
			})
			.addCase(putUser.fulfilled, (state, action: PayloadAction<User>) => {
				return {
					...state,
					user: action.payload,
					isLoading: false,
				};
			});
	},
});

export const { logIn, logOut } = dataSlice.actions;

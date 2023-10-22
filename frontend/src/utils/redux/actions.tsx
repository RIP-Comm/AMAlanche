import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthGoogleResponse } from '../types/Auth.types';
import { getUser, putUser } from '../axios/User.axios';
import { User } from '../types/User.types';
import { googleLogIn, googleRefresh } from '../axios/Auth.axios';
import { axiosInstance } from '../axios/Axios';
import { Channel } from '../types/Channel.types';
import { createAllUserChannels, getAllUserChannels } from '../axios/User.channel.axios';

export interface AuthState {
	isAuthenticated: boolean;
	accessToken: string;
	expiry: string;
}

export interface AppState {
	auth: AuthState;
	user: User | null;
	channels: Channel[];
	isLoading: boolean;
}

const initialState: AppState = {
	auth: {
		isAuthenticated: false,
		accessToken: '',
		expiry: '',
	},
	user: null,
	channels: [],
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
			})
			.addCase(getAllUserChannels.pending, (state) => {
				return {
					...state,
					isLoading: true,
				};
			})
			.addCase(getAllUserChannels.fulfilled, (state, action: PayloadAction<Channel[]>) => {
				return {
					...state,
					channels: action.payload,
					isLoading: false,
				};
			})
			.addCase(createAllUserChannels.pending, (state) => {
				return {
					...state,
					isLoading: true,
				};
			})
			.addCase(createAllUserChannels.fulfilled, (state, action: PayloadAction<Channel>) => {
				state.channels.push(action.payload);
				state.isLoading = false;
			});
	},
});

export const { logIn, logOut } = dataSlice.actions;

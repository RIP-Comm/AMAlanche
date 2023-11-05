import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthGoogleResponse } from '../../types/Auth.types';
import { User } from '../../types/User.types';
import { setAxsiosHeader } from '../../axios/Axios';
import { Channel } from '../../types/Channel.types';
import { createChannels, getAllUserChannels, getChannelById, joinChannels } from './Channel.axios';
import { googleLogIn, googleRefresh } from './Auth.axios';
import { getUser, putUser } from './User.actions';
import { createQa } from './Qa.axios';
import { QaDto } from '../../types/Qa.types';

export interface AuthState {
	isAuthenticated: boolean;
	accessToken: string;
	expiry: string;
	isLoading: boolean;
}

export interface AppState {
	auth: AuthState;
	user: User | null;
	channels: Channel[];
	isLoading: boolean;
	beforeLoginUrl: string | null;
}

const initialState: AppState = {
	auth: {
		isAuthenticated: false,
		accessToken: '',
		expiry: '',
		isLoading: false,
	},
	user: null,
	channels: [],
	isLoading: false,
	beforeLoginUrl: null,
};

export const dataSlice = createSlice({
	name: 'appStorage',
	initialState,
	reducers: {
		logIn: (state, action: PayloadAction<AuthGoogleResponse>) => {
			action.payload.userId && localStorage.setItem('userId', action.payload.userId);
			localStorage.setItem('RefreshToken', action.payload.refreshToken);
			localStorage.setItem('AuthType', 'google');
			setAxsiosHeader(action.payload);

			return {
				...state,
				auth: {
					isAuthenticated: true,
					accessToken: action.payload.accessToken,
					expiry: action.payload.expiry,
					isLoading: false,
				},
			};
		},
		logOut: (state) => {
			localStorage.clear();
			window.location.href = '/';
			return {
				...initialState,
			};
		},
		setBeforeLogin: (state, action: PayloadAction<string | null>) => {
			return {
				...state,
				beforeLoginUrl: action.payload,
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
					auth: {
						...state.auth,
						isLoading: true,
					},
					isLoading: true,
				};
			})
			.addCase(googleRefresh.fulfilled, (state) => {
				return {
					...state,
					auth: {
						...state.auth,
						isLoading: false,
					},
					isLoading: false,
				};
			})
			.addCase(googleRefresh.rejected, (state) => {
				return {
					...state,
					auth: {
						...state.auth,
						isLoading: false,
					},
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
			.addCase(getUser.rejected, (state) => {
				return {
					...state,
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
			.addCase(putUser.rejected, (state) => {
				return {
					...state,
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
			.addCase(getAllUserChannels.rejected, (state) => {
				return {
					...state,
					isLoading: false,
				};
			})
			.addCase(createChannels.pending, (state) => {
				return {
					...state,
					isLoading: true,
				};
			})
			.addCase(createChannels.fulfilled, (state, action: PayloadAction<Channel>) => {
				return {
					...state,
					channels: [...state.channels, action.payload],
					isLoading: false,
				};
			})
			.addCase(createChannels.rejected, (state) => {
				return {
					...state,
					isLoading: false,
				};
			})
			.addCase(createQa.pending, (state) => {
				return {
					...state,
					isLoading: true,
				};
			})
			.addCase(createQa.fulfilled, (state, action: PayloadAction<QaDto>) => {
				return {
					...state,
					isLoading: false,
				};
			})
			.addCase(createQa.rejected, (state) => {
				return {
					...state,
					isLoading: false,
				};
			})
			.addCase(getChannelById.pending, (state) => {
				return {
					...state,
					/*isLoading: true,*/
				};
			})
			.addCase(getChannelById.fulfilled, (state, action: PayloadAction<Channel>) => {
				return {
					...state,
					channels: state.channels.map((item) => {
						if (item.id === action.payload.id) {
							return action.payload;
						}
						return item;
					}),
					isLoading: false,
				};
			})
			.addCase(getChannelById.rejected, (state) => {
				return {
					...state,
					isLoading: false,
				};
			})
			.addCase(joinChannels.pending, (state) => {
				return {
					...state,
					isLoading: true,
				};
			})
			.addCase(joinChannels.fulfilled, (state, action: PayloadAction<Channel>) => {
				return {
					...state,
					channels: state.channels.map((item) => {
						if (item.id === action.payload.id) {
							return action.payload;
						}
						return item;
					}),
					isLoading: false,
				};
			})
			.addCase(joinChannels.rejected, (state) => {
				return {
					...state,
					isLoading: false,
				};
			});
	},
});

export const { logIn, logOut, setBeforeLogin } = dataSlice.actions;

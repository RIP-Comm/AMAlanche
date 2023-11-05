import { Middleware } from 'redux';
import { googleRefresh } from '../actions/Auth.axios';
import { MiddlewareAPI } from '@reduxjs/toolkit';

const refreshTokenMiddleware: Middleware =
	({ getState, dispatch }: MiddlewareAPI) =>
	(next) =>
	(action) => {
		const state = getState();

		if (action.type.includes('fulfilled') || action.type.includes('rejected')) {
			return next(action);
		}

		if (state.auth.isAuthenticated) {
			const currentTime = Date.now() / 1000;
			const expiryTimeStr = state.auth.expiry;
			if (expiryTimeStr) {
				const expiryTime = new Date(expiryTimeStr).getTime() / 1000;
				if (expiryTime * 0.8 > currentTime) {
					if (localStorage.getItem('AuthType') === 'google') {
						return dispatch(googleRefresh() as any).then(() => {
							return next(action);
						});
					}
				}
			}
		}
		return next(action);
	};

export default refreshTokenMiddleware;

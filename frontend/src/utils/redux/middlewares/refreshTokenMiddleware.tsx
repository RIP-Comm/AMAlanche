import { Middleware } from 'redux';
import { googleRefresh } from '../../axios/auth.axios';

const refreshTokenMiddleware: Middleware = (store) => (next) => (action) => {
	const state = store.getState();

	if (state.auth.isAuthenticated) {
		const currentTime = Date.now() / 1000;
		const expiryTimeStr = state.auth.expiry;
		if (expiryTimeStr) {
			const expiryTime = new Date(expiryTimeStr).getTime() / 1000;
			if (expiryTime * 0.8 > currentTime) {
				if (localStorage.getItem('authType') === 'google') {
					googleRefresh()(store.dispatch, state, null);
				}
			}
		}
	}

	const result = next(action);
	return result;
};

export default refreshTokenMiddleware;

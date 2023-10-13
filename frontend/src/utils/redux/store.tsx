import { dataSlice } from './actions';
import { configureStore } from '@reduxjs/toolkit';
import refreshTokenMiddleware from './middlewares/refreshTokenMiddleware';

const store = configureStore({
	reducer: dataSlice.reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(refreshTokenMiddleware),
});

export default store;

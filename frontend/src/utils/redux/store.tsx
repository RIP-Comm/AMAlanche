import { dataSlice } from './Actions';
import { configureStore } from '@reduxjs/toolkit';
import refreshTokenMiddleware from './middlewares/RefreshTokenMiddleware';

const store = configureStore({
	reducer: dataSlice.reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(refreshTokenMiddleware),
});

export default store;

import React, { useEffect } from 'react';
import './App.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { GOOGLE_CLIENT_ID } from './utils/Env';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NavbarContainer from './containers/NavbarContainer';
import store from './utils/redux/Store';
import AppPage from './pages/AppPage';
import ProtectedRoute from './utils/ProtectedRoute';
import LoaderSpinner from './components/LoaderSpinner';
import { useSelector } from 'react-redux';
import { AppState } from './utils/redux/actions/Actions';
import { googleRefresh } from './utils/redux/actions/Auth.axios';

const theme = extendTheme({
	styles: {
		global: {
			'#root': {
				whiteSpace: 'pre-wrap',
				height: '100%',
				minHeight: '100%',
				maxHeight: '100%',
				width: '100%',
				minWidth: '100%',
				maxWidth: '100%',
			},
		},
	},
});

function App() {
	const isLoading = useSelector((state: AppState) => state.isLoading);

	useEffect(() => {
		if (!store.getState().auth.isAuthenticated && localStorage.getItem('AuthType') === 'google') {
			store.dispatch(googleRefresh());
		}
	}, []);

	return (
		<ChakraProvider theme={theme}>
			<LoaderSpinner isLoading={isLoading} />
			<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
				<NavbarContainer />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route
						path="/app/*"
						element={
							<ProtectedRoute>
								<AppPage />
							</ProtectedRoute>
						}
					/>
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</GoogleOAuthProvider>
		</ChakraProvider>
	);
}

export default App;

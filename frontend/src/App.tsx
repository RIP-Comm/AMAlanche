import React, { useEffect } from 'react';
import './App.css';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { GOOGLE_CLIENT_ID } from './utils/Env';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NavbarContainer from './containers/NavbarContainer';
import store from './utils/redux/store';
import { googleRefresh } from './utils/axios/auth.axios';
import AppPage from './pages/AppPage';
import ProtectedRoute from './utils/ProtectedRoute';
import SocketTestPage from './pages/SocketTestPage';

function App() {
	useEffect(() => {
		if (localStorage.getItem('authType') === 'google') {
			store.dispatch(googleRefresh());
		}
	}, []);

	return (
		<Container maxW="full" h="100vh">
			<ChakraProvider>
				<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
					<NavbarContainer />
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/socket" element={<SocketTestPage />} />
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
		</Container>
	);
}

export default App;

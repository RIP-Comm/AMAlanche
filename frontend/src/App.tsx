import React, { useEffect } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './containers/Homepage';
import TestPage from './containers/TestPage';
import Login from './containers/Login';
import { GOOGLE_CLIENT_ID } from './utils/Env';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './containers/Navbar';
import store from './utils/redux/store';
import { googleRefresh } from './utils/axios/auth.axios';

function App() {
	useEffect(() => {
		if (localStorage.getItem('loginType') === 'google') {
			store.dispatch(googleRefresh());
		}
	}, []);

	return (
		<ChakraProvider>
			<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
				<div className="flex flex-col">
					<Navbar />
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Homepage />} />
							<Route path="/login" element={<Login />} />
							<Route path="/test" element={<TestPage />} />
							<Route path="*" element={<Homepage />} />
						</Routes>
					</BrowserRouter>
				</div>
			</GoogleOAuthProvider>
		</ChakraProvider>
	);
}

export default App;

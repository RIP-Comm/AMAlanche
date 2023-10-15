import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '../utils/Env';
import { Button, Flex } from '@chakra-ui/react';
import store from '../utils/redux/store';
import { googleLogIn } from '../utils/axios/auth.axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../utils/redux/actions';

function LoginPage() {
	const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);
	const navigate = useNavigate();

	const login = useGoogleLogin({
		onSuccess: async (response) => {
			store.dispatch(googleLogIn(response.code)).then((result) => {
				if (result.meta.requestStatus === 'fulfilled') {
					navigate('/app');
				}
			});
		},
		flow: 'auth-code',
	});

	return (
		<>
			<h1 className="text-3xl font-bold">Login</h1>
			{isAuthenticated ? (
				<Flex>
					<p className="text-2xl font-bold">You have already successfully logged in.</p>
				</Flex>
			) : GOOGLE_CLIENT_ID != null && GOOGLE_CLIENT_ID !== 'client-id' ? (
				<Button onClick={() => login()}>Sign in with Google</Button>
			) : null}
		</>
	);
}

export default LoginPage;

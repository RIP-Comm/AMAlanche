import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '../utils/Env';
import { Button } from '@chakra-ui/react';
import store from '../utils/redux/store';
import { googleLogIn } from '../utils/axios/auth.axios';
import { useNavigate } from 'react-router-dom';

function Login() {
	const navigate = useNavigate();

	const login = useGoogleLogin({
		onSuccess: async (response) => {
			store.dispatch(googleLogIn(response.code)).then(() => navigate('/'));
		},
		flow: 'auth-code',
	});

	return (
		<>
			<h1>Login</h1>
			{GOOGLE_CLIENT_ID != null && GOOGLE_CLIENT_ID !== 'client-id' ? (
				<Button onClick={() => login()}>Sign in with Google</Button>
			) : null}
		</>
	);
}

export default Login;

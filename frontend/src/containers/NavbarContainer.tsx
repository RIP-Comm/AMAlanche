import React from 'react';
import store from '../utils/redux/store';
import { AppState, logOut } from '../utils/redux/actions';
import { Button, Flex, Link } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { SettingsIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

function NavbarContainer() {
	const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);
	let navigate = useNavigate();

	const handleLogin = () => {
		navigate('/login');
	};

	const handleLogout = () => {
		store.dispatch(logOut());
	};

	return (
		<Flex justifyContent="start" align="center" as="nav" bg="blue.500" h="4rem" px={4}>
			<Link href="/" p={2} className="text-3xl font-bold">
				AMAlanche
			</Link>
			<Link href="/app" p={2} className="text-2xl">
				App
			</Link>
			<Flex justifyContent="space-between" align="center" ml="auto" w="8rem">
				{!isAuthenticated ? (
					<Button onClick={handleLogin}>Login</Button>
				) : (
					<>
						<Button onClick={handleLogout}>Logout</Button>
						<Link href="/app/profile">
							<SettingsIcon boxSize={6} />
						</Link>
					</>
				)}
			</Flex>
		</Flex>
	);
}

export default NavbarContainer;

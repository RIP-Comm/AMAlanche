import React from 'react';
import store from '../utils/redux/store';
import { logOut } from '../utils/redux/actions';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

function Navbar() {
	const isLogged = useSelector((state: any) => state.auth.isLogged);

	const handleLogout = () => {
		store.dispatch(logOut());
	};

	return (
		<Box as="nav" bg="blue.500" h="4rem" py={2}>
			<Flex justify="between" align="center" px={4}>
				<h1 className="text-3xl font-bold">AMAlanche</h1>
				{isLogged ? (
					<Button onClick={handleLogout} ml="auto">
						Logout
					</Button>
				) : null}
			</Flex>
		</Box>
	);
}

export default Navbar;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@chakra-ui/react';

function Homepage() {
	let navigate = useNavigate();

	return (
		<>
			<h1 className="text-3xl font-bold">AMAlanche</h1>
			<Stack direction="row" spacing={4} align="center">
				<Button
					colorScheme="teal"
					variant="solid"
					onClick={() => {
						navigate('/test');
					}}
				>
					Navigate Test Page
				</Button>
				<Button
					colorScheme="teal"
					variant="outline"
					onClick={() => {
						navigate('/login');
					}}
				>
					Login
				</Button>
			</Stack>
		</>
	);
}

export default Homepage;

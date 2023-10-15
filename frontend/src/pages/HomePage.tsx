import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@chakra-ui/react';

function HomePage() {
	let navigate = useNavigate();

	return (
		<>
			<Stack direction="row" spacing={4} align="center">
				<Button
					colorScheme="teal"
					variant="solid"
					onClick={() => {
						navigate('/socket');
					}}
				>
					Navigate Socket Test Page
				</Button>
			</Stack>
		</>
	);
}

export default HomePage;

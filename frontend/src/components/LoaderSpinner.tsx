import { Box, Flex, Spinner } from '@chakra-ui/react';

interface LoaderSpinnerProps {
	isLoading: boolean;
}

const LoaderSpinner = ({ isLoading }: LoaderSpinnerProps) => {
	return (
		<Box
			display={isLoading ? 'block' : 'none'}
			position="fixed"
			top="0"
			left="0"
			right="0"
			bottom="0"
			backgroundColor="rgba(0, 0, 0, 0.6)"
			zIndex="9999"
		>
			<Flex height="100%" alignItems="center" justifyContent="center">
				<Spinner size="xl" color="white" />
			</Flex>
		</Box>
	);
};

export default LoaderSpinner;

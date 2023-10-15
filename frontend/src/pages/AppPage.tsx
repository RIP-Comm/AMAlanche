import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import ProfileContainer from '../containers/ProfileContainer';
import ChannelContainer from '../containers/ChannelContainer';

function AppPage() {
	return (
		<>
			<Flex direction="column" justifyContent="start" align="start" px={4}>
				<Routes>
					<Route path="/" element={<ChannelContainer />} />
					<Route path="/profile" element={<ProfileContainer />} />
					<Route path="*" element={<Navigate to="/app" replace />} />
				</Routes>
			</Flex>
		</>
	);
}

export default AppPage;

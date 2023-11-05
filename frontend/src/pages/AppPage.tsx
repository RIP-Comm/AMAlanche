import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProfileContainer from '../containers/ProfileContainer';
import ChannelListContainer from '../containers/ChannelListContainer';
import ChannelContainer from '../containers/ChannelContainer';

function AppPage() {
	return (
		<Routes>
			<Route path="/" element={<ChannelListContainer />} />
			<Route path="/channel/:channelId" element={<ChannelContainer />} />
			<Route path="/profile" element={<ProfileContainer />} />
			{<Route path="*" element={<Navigate to="/app" replace />} />}
		</Routes>
	);
}

export default AppPage;

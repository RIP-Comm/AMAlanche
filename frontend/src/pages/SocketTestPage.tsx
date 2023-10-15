import React from 'react';
import { SocketProvider } from '../providers/SocketProvider';

function SocketTestPage() {
	return (
		<>
			<SocketProvider>
				<h1>Socket Test Page</h1>
			</SocketProvider>
		</>
	);
}

export default SocketTestPage;

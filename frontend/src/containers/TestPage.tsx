import React from 'react';
import { SocketProvider } from '../providers/SocketProvider';

function TestPage() {
	return (
		<>
			<SocketProvider>
				<h1>Test Page</h1>
			</SocketProvider>
		</>
	);
}

export default TestPage;

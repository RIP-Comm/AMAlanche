import React, { useEffect } from 'react';
import { SocketProvider } from '../utils/SocketProvider';

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

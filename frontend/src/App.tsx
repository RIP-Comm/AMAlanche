import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './containers/Homepage';
import TestPage from './containers/TestPage';
import Login from './containers/Login';

function App() {
	return (
		<ChakraProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/test" element={<TestPage />} />
					<Route path="*" element={<Homepage />} />
				</Routes>
			</BrowserRouter>
		</ChakraProvider>
	);
}

export default App;

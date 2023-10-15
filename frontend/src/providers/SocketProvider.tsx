import React, { ReactNode, useEffect, useState } from 'react';
import { Message } from '../utils/types/Socket.types';
import { API_BASE_URL } from '../utils/Env';
import io from 'socket.io-client';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (API_BASE_URL) {
			const newSocket = io(API_BASE_URL);

			newSocket.on('connect', () => {
				newSocket.emit('join', 'room');
				console.log('Socket.io connected');
			});

			newSocket.on('message', (message: Message) => {
				console.log('Message received', message);
				setMessages((prevMessages) => [...prevMessages, message]);
			});

			return () => {
				if (newSocket) {
					newSocket.disconnect();
				}
			};
		} else {
			throw new Error('socket url not found');
		}
	}, []);

	return <>{children}</>;
};

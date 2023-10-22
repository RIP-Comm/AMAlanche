import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Channel } from '../utils/types/Channel.types';

interface ChannelCardProps {
	channel: Channel;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel }) => {
	let navigate = useNavigate();

	const [isOwner, setIsOwner] = useState<boolean>(false);

	useEffect(() => {
		const userId = localStorage.getItem('userId');
		if (userId == channel.ownerId) {
			setIsOwner(true);
		} else {
			setIsOwner(false);
		}
	}, [channel]);

	return (
		<Card mb="1rem" key={channel.id}>
			<CardBody onClick={() => navigate('channel/' + channel.id)}>
				<Text>{channel.name}</Text>
				{isOwner ? (
					<Text
						position="absolute"
						top="0"
						right="0"
						backgroundColor="red"
						color="white"
						padding="2px 4px"
						borderRadius="md"
					>
						{isOwner ? 'Owner' : 'Not Owner'}
					</Text>
				) : null}
			</CardBody>
		</Card>
	);
};

export default ChannelCard;

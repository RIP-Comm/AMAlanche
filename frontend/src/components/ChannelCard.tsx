import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Tag, TagLabel, Text } from '@chakra-ui/react';
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
					<Tag
						position="absolute"
						top="0"
						right="0"
						padding="2px 4px"
						size="lg"
						colorScheme="red"
						borderRadius="full"
					>
						<TagLabel>Owner</TagLabel>
					</Tag>
				) : null}
			</CardBody>
		</Card>
	);
};

export default ChannelCard;

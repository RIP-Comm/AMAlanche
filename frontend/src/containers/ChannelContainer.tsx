import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { AppState } from '../utils/redux/Actions';
import { Channel, CreateChannel } from '../utils/types/Channel.types';

const ChannelContainer = () => {
	let { channelId } = useParams();
	const channel: Channel | undefined = useSelector(
		(state: AppState) => state.channels?.find((item: Channel) => item.id == channelId),
	);

	return (
		<Flex direction="column" flexWrap="wrap">
			<h1 className="text-3xl font-bold">{channel?.name}</h1>
		</Flex>
	);
};

export default ChannelContainer;

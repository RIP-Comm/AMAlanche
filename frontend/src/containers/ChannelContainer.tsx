import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Button,
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Tag,
	TagLabel,
	useToast,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { AppState } from '../utils/redux/actions/Actions';
import { Channel } from '../utils/types/Channel.types';
import QaListContainer from './QaListContainer';
import PoolsListContainer from './PoolsListContainer';
import store from '../utils/redux/Store';
import { getChannelById, joinChannels } from '../utils/redux/actions/Channel.axios';

const ChannelContainer = () => {
	const navigate = useNavigate();
	const toast = useToast();
	let { channelId } = useParams();
	const channel: Channel | undefined = useSelector(
		(state: AppState) => state.channels?.find((item: Channel) => item.id == channelId),
	);
	const [hasAccess, setHasAccess] = useState<boolean>(true);
	const [isOwner, setIsOwner] = useState<boolean>(false);

	interface HeaderChannelProps {
		channel: Channel;
		isOwner: boolean;
	}

	const copyCurrentUrl = () => {
		navigator.clipboard
			.writeText(window.location.href)
			.then(() => {
				toast({
					title: 'Success!',
					description: 'URL copied to clipboard.',
					status: 'success',
					duration: 2000,
					isClosable: true,
				});
			})
			.catch((err) => {
				toast({
					title: 'Error',
					description: 'Failed to copy URL.',
					status: 'error',
					duration: 2000,
					isClosable: true,
				});
				console.error('Failed to copy URL: ', err);
			});
	};

	const HeaderChannel = React.memo(function HeaderChannel({
		channel,
		isOwner,
	}: HeaderChannelProps) {
		return (
			<Flex direction="row" flexWrap="nowrap" maxHeight="100%" justifyContent="space-between">
				<h1 className="text-3xl font-bold">Channel: {channel?.name}</h1>
				<div>
					{isOwner ? (
						<Tag size="lg" colorScheme="red" w="5rem" h="100%">
							<TagLabel>Owner</TagLabel>
						</Tag>
					) : null}
					<Button onClick={copyCurrentUrl}>Share</Button>
				</div>
			</Flex>
		);
	});

	function handleGetChannelById() {
		store.dispatch(getChannelById(channelId || '0')).then((response: any) => {
			if (response.error) {
				if (response.payload.status === 403) {
					setHasAccess(false);
				} else {
					toast({
						title: 'Error',
						description: 'Failed to get channel',
						status: 'error',
						duration: 2000,
						isClosable: true,
					});
					console.error('Failed to get channel: ', response.payload.data.error);
				}
				navigate('/app');
			} else {
				setHasAccess(true);
			}
		});
	}

	useEffect(() => {
		if (channel) {
			const userId = localStorage.getItem('userId');
			if (userId == channel?.ownerId) {
				setIsOwner(true);
			} else {
				setIsOwner(false);
			}
		}

		if (hasAccess) {
			handleGetChannelById();
			const getChannelInterval = setInterval(() => handleGetChannelById(), 3333);

			return () => {
				clearInterval(getChannelInterval);
			};
		}
	}, [channel?.id, hasAccess]);

	const joinChannelHandler = () => {
		store.dispatch(joinChannels(channelId || '0')).then((response: any) => {
			if (response.error) {
				toast({
					title: 'Error',
					description: 'Failed to join channel',
					status: 'error',
					duration: 2000,
					isClosable: true,
				});
				console.error('Failed to join channel: ', response.payload.data.error);
			} else {
				window.location.reload();
			}
		});
	};

	return (
		<>
			{channel && hasAccess ? (
				<Tabs
					orientation="vertical"
					variant="soft-rounded"
					colorScheme="green"
					w="100%"
					maxWidth="100%"
					height="95%"
					minHeight="95%"
					maxHeight="95%"
				>
					<TabList width="6rem" borderRight="1px" borderColor="gray.200" bg="blue.100">
						<Tab>Q&A</Tab>
						<Tab>Pools</Tab>
					</TabList>

					<TabPanels style={{ overflowY: 'auto', overflowX: 'hidden', maxWidth: '100%' }}>
						<TabPanel>
							<HeaderChannel channel={channel} isOwner={isOwner} />
							<QaListContainer channel={channel} isOwner={isOwner}></QaListContainer>
						</TabPanel>
						<TabPanel>
							<HeaderChannel channel={channel} isOwner={isOwner} />
							<PoolsListContainer></PoolsListContainer>
						</TabPanel>
					</TabPanels>
				</Tabs>
			) : (
				<Flex direction="column" pt={4}>
					<h2 className="text-2xl font-bold">Do you want to access the channel?</h2>
					<Button colorScheme="teal" onClick={joinChannelHandler}>
						{' '}
						Yes
					</Button>
					<Button colorScheme="red" onClick={() => navigate('/app')}>
						{' '}
						No
					</Button>
				</Flex>
			)}
		</>
	);
};

export default ChannelContainer;

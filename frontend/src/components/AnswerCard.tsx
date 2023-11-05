import { Divider, Flex, Heading, Tag, TagLabel, Text, VStack } from '@chakra-ui/react';
import React, { Suspense, useEffect, useState } from 'react';
import { Channel } from '../utils/types/Channel.types';
import { QaDto } from '../utils/types/Qa.types';
import AnswerForm from './AnswerForm';

interface AnswerCardProps {
	channel: Channel;
	qa: QaDto;
	level: number;
}

interface DividerMemoProps {
	level: number;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ channel, qa, level }) => {
	const [isOwner, setIsOwner] = useState<boolean>(false);
	const DividerMemo = React.memo(function DividerMemo({ level }: DividerMemoProps) {
		return (
			<>
				{Array.from({ length: level }, (_, index) => (
					<Divider
						key={'divider-' + channel.id + '-' + qa.id + '-' + index}
						orientation="vertical"
						borderColor="black"
						borderWidth={2}
					/>
				))}
			</>
		);
	});

	useEffect(() => {
		if (channel && qa) {
			if (channel?.ownerId == qa?.ownerId) {
				setIsOwner(true);
			} else {
				setIsOwner(false);
			}
		}
	}, [channel, qa]);

	return (
		<Flex h="100%" flexDir="row" maxWidth="100%">
			<Flex flexDir="column" h="100%" p="2" direction="column" align="center" justify="center">
				<VStack shouldWrapChildren spacing="0.5rem" align="stretch" h="full">
					<DividerMemo level={level} />
				</VStack>
			</Flex>
			<Flex position="relative" h="100%" flex="1" flexDir="column" wrap="nowrap" p="2">
				{isOwner ? (
					<Tag
						position="absolute"
						top="0px"
						right="0"
						size="lg"
						colorScheme="red"
						borderRadius="full"
					>
						<TagLabel>Owner</TagLabel>
					</Tag>
				) : null}
				<Heading size="xs">{qa.username}</Heading>
				<Text>{qa.question}</Text>
				<AnswerForm channel={channel} qa={qa} />
				<Divider orientation="horizontal" pt={2} />
				{qa.children?.map((item: QaDto, index) => {
					return (
						<Suspense
							key={'answer-' + channel.id + '-' + qa.id + '-' + index}
							fallback={<div>Loading...</div>}
						>
							<AnswerCard
								key={'answer-' + channel.id + '-' + qa.id + '-' + index}
								channel={channel}
								qa={item}
								level={0}
							/>
						</Suspense>
					);
				})}
			</Flex>
		</Flex>
	);
};

export default AnswerCard;

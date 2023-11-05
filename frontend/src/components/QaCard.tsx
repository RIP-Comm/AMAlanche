import {
	Card,
	CardBody,
	CardHeader,
	Collapse,
	Divider,
	Flex,
	Heading,
	IconButton,
	Tag,
	TagLabel,
	useDisclosure,
} from '@chakra-ui/react';
import React, { Suspense, useEffect, useState } from 'react';
import { QaDto } from '../utils/types/Qa.types';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Channel } from '../utils/types/Channel.types';
import AnswerForm from './AnswerForm';

const AnswerCard = React.lazy(() => import('./AnswerCard'));

interface QaCardProps {
	channel: Channel;
	qa: QaDto;
}

const QaCard: React.FC<QaCardProps> = ({ channel, qa }) => {
	const { isOpen: isOpenQuestion, onToggle: onToggleQuestion } = useDisclosure();
	const [rotateIcon, setRotateIcon] = useState(false);
	const [isOwner, setIsOwner] = useState<boolean>(false);

	const handleToggle = () => {
		onToggleQuestion();
		setRotateIcon(!rotateIcon);
	};

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
		<Card mt={2} maxWidth="100%">
			<CardHeader>
				<Heading size="xs">{qa.username}</Heading>
			</CardHeader>
			{isOwner ? (
				<Tag position="absolute" top="0" right="0" size="lg" colorScheme="red" borderRadius="full">
					<TagLabel>Owner</TagLabel>
				</Tag>
			) : null}
			<CardBody>
				<Flex direction="column" maxHeight="100%">
					<Flex direction="row" maxHeight="100%" justifyContent="space-between" alignItems="center">
						<p>{qa.question}</p>
						<IconButton
							onClick={handleToggle}
							icon={rotateIcon ? <ChevronUpIcon /> : <ChevronDownIcon />}
							aria-label="Espandi"
							variant="ghost"
						/>
					</Flex>
					{isOpenQuestion ? <AnswerForm channel={channel} qa={qa} /> : null}
				</Flex>
				<Divider orientation="horizontal" pt={2} />
				<Collapse in={isOpenQuestion}>
					{qa.children?.map((item: QaDto, index) => {
						return (
							<Suspense
								key={'answer-' + channel.id + '-' + qa.id + '-' + index}
								fallback={<div>Loading...</div>}
							>
								<AnswerCard channel={channel} qa={item} level={0} />
							</Suspense>
						);
					})}
				</Collapse>
			</CardBody>
		</Card>
	);
};

export default QaCard;

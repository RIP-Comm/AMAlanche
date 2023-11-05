import React, { ChangeEvent, useState } from 'react';
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Stack,
	Textarea,
} from '@chakra-ui/react';
import { CreateQA, QaDto } from '../utils/types/Qa.types';
import store from '../utils/redux/Store';
import { createQa } from '../utils/redux/actions/Qa.axios';
import QaCard from '../components/QaCard';
import { Channel } from '../utils/types/Channel.types';

interface FormDataValidate {
	question: string | null;
}

interface QaListContainerProps {
	channel: Channel;
	isOwner: boolean;
}

const QaListContainer = ({ channel, isOwner }: QaListContainerProps) => {
	const [formData, setFormData] = useState<CreateQA>({
		channelId: channel.id,
		question: '',
		parentId: null,
	});

	const [errors, setErrors] = useState<FormDataValidate>({
		question: null,
	});

	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const validateForm = () => {
		if (!formData?.question?.trim()) {
			setErrors({ question: 'Username is required' });
			return false;
		} else {
			setErrors({ question: null });
		}
		return true;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			const newQa: CreateQA = {
				channelId: channel.id,
				question: formData.question,
				parentId: formData.parentId,
			};
			store.dispatch(createQa(newQa)).then((result: any) => {
				if (result.error == null) {
					setFormData({ ...formData, question: '' });
					setErrors({ question: null });
				} else {
					console.error(result);
					setErrors({ question: result.payload.data.error });
				}
			});
		}
	};

	return (
		<Flex direction="column" flexWrap="nowrap" maxHeight="100%">
			<h2 className="text-3xl font-bold">Q&A</h2>
			{isOwner ? (
				<form onSubmit={handleSubmit}>
					<Stack direction="column" spacing={4}>
						<FormControl isRequired isInvalid={!!errors.question}>
							<FormLabel htmlFor="question">Question</FormLabel>
							<Textarea
								id="question"
								name="question"
								placeholder="Question"
								value={formData.question}
								onChange={handleChange}
								resize="vertical"
							/>
							<FormErrorMessage>{errors.question}</FormErrorMessage>
						</FormControl>

						<Button type="submit" colorScheme="blue">
							Add
						</Button>
					</Stack>
				</form>
			) : null}
			<Flex direction="column" flexWrap="wrap">
				{channel?.qas?.map((qa: QaDto, index: number) => (
					<QaCard key={index + '-' + qa.id} channel={channel} qa={qa} />
				))}
			</Flex>
		</Flex>
	);
};

export default QaListContainer;

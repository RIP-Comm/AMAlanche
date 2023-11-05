import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Stack,
	Textarea,
} from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';
import { Channel } from '../utils/types/Channel.types';
import { CreateQA, QaDto } from '../utils/types/Qa.types';
import store from '../utils/redux/Store';
import { createQa } from '../utils/redux/actions/Qa.axios';
import { ChatIcon } from '@chakra-ui/icons';

interface FormDataValidate {
	answer: string | null;
}

interface AnswerFormProps {
	channel: Channel;
	qa: QaDto;
}

const AnswerForm: React.FC<AnswerFormProps> = ({ channel, qa }) => {
	const [visible, setVisible] = useState<boolean>(false);

	const [formData, setFormData] = useState<CreateQA>({
		channelId: channel.id,
		question: '',
		parentId: qa.id,
	});

	const [errors, setErrors] = useState<FormDataValidate>({
		answer: null,
	});

	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = event.target;
		setFormData({ ...formData, ['question']: value });
	};

	const validateForm = () => {
		if (!formData?.question?.trim()) {
			setErrors({ answer: 'Username is required' });
			return false;
		} else {
			setErrors({ answer: null });
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
					setVisible(false);
					setFormData({ ...formData, question: '' });
					setErrors({ answer: null });
				} else {
					console.error(result);
					setErrors({ answer: result.payload.data.error });
				}
			});
		}
	};

	return (
		<>
			{visible ? (
				<form onSubmit={handleSubmit}>
					<Stack direction="column" spacing={4}>
						<FormControl isRequired isInvalid={!!errors.answer}>
							<FormLabel htmlFor="answer">Answer</FormLabel>
							<Textarea
								id="answer"
								name="answer"
								placeholder="Answer"
								value={formData.question}
								onChange={handleChange}
								resize="vertical"
							/>
							<FormErrorMessage>{errors.answer}</FormErrorMessage>
						</FormControl>

						<Button type="submit" colorScheme="blue">
							Add
						</Button>
						<Button colorScheme="gray" onClick={() => setVisible(false)}>
							Cancel
						</Button>
					</Stack>
				</form>
			) : (
				<ChatIcon onClick={() => setVisible(true)}>Rispondi</ChatIcon>
			)}
		</>
	);
};

export default AnswerForm;

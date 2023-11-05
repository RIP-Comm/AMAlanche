import React, { useState } from 'react';
import {
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { AppState } from '../utils/redux/actions/Actions';
import ChannelCard from '../components/ChannelCard';
import store from '../utils/redux/Store';
import { CreateChannel } from '../utils/types/Channel.types';
import { createChannels } from '../utils/redux/actions/Channel.axios';

interface FormDataValidate {
	name: string | null;
}

function ChannelListContainer() {
	const channels = useSelector((state: AppState) => state.channels);
	const [formData, setFormData] = useState<CreateChannel>({
		name: '',
	});
	const [errors, setErrors] = useState<FormDataValidate>({
		name: null,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const validateForm = () => {
		if (!formData.name.trim()) {
			setErrors({ name: 'Name is required' });
			return false;
		} else {
			setErrors({ name: null });
		}
		return true;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			const newChannel: CreateChannel = {
				name: formData.name,
			};
			store.dispatch(createChannels(newChannel)).then((result: any) => {
				if (result.error == null) {
					setFormData({ ...formData, name: '' });
					setErrors({ name: null });
				} else {
					setErrors({ name: result.payload.data.error });
				}
			});
		}
	};

	return (
		<Flex direction="column" flexWrap="nowrap">
			<form onSubmit={handleSubmit}>
				<Stack direction="column" spacing={4}>
					<FormControl isRequired isInvalid={!!errors.name}>
						<FormLabel htmlFor="name">Name</FormLabel>
						<Input
							type="text"
							id="name"
							name="name"
							placeholder="Name"
							value={formData.name}
							onChange={handleChange}
						/>
						<FormErrorMessage>{errors.name}</FormErrorMessage>
					</FormControl>

					<Button type="submit" colorScheme="blue">
						Add
					</Button>
				</Stack>
			</form>
			<br />
			<Flex direction="column" flexWrap="wrap">
				<h1 className="text-3xl font-bold">Channels:</h1>
				{channels?.map((channel) => <ChannelCard key={channel.id} channel={channel} />)}
			</Flex>
		</Flex>
	);
}

export default ChannelListContainer;

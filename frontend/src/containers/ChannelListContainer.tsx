import React, { useEffect, useState } from 'react';
import {
	Button,
	Card,
	CardBody,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
	Text,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { AppState } from '../utils/redux/Actions';
import { useNavigate } from 'react-router-dom';
import ChannelCard from '../components/ChannelCard';
import { UpdateUserRequest } from '../utils/types/User.types';
import store from '../utils/redux/Store';
import { putUser } from '../utils/axios/User.axios';
import { CreateChannel } from '../utils/types/Channel.types';
import { createAllUserChannels } from '../utils/axios/User.channel.axios';

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
			store.dispatch(createAllUserChannels(newChannel)).then((result: any) => {
				if (result.error == null) {
					setFormData({ ...formData, name: '' });
					setErrors({ name: null });
				} else {
					setErrors({ name: result.error.message() });
				}
			});
		}
	};

	return (
		<>
			<br />
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
		</>
	);
}

export default ChannelListContainer;

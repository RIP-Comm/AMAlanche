import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { AppState } from '../utils/redux/actions';
import store from '../utils/redux/store';
import { putUser } from '../utils/axios/user.axios';
import { UpdateUserRequest } from '../utils/types/User.types';

interface FormData {
	email: string;
	username: string;
}

interface FormDataValidate {
	username: string | null;
}

function ProfileContainer() {
	const user = useSelector((state: AppState) => state.user);

	const [formData, setFormData] = useState<FormData>({
		username: '',
		email: '',
	});

	const [errors, setErrors] = useState<FormDataValidate>({
		username: null,
	});

	useEffect(() => {
		setFormData((prevState) => {
			return {
				...prevState,
				email: user?.email || '',
				username: user?.username || '',
			};
		});
	}, [user]);

	useEffect(() => {
		validateForm();
	}, [formData]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const validateForm = () => {
		if (!formData.username.trim()) {
			setErrors({ username: 'Username is required' });
			return false;
		} else {
			setErrors({ username: null });
		}
		return true;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			const updatedUser: UpdateUserRequest = {
				id: store.getState().user?.id || 0,
				username: formData.username,
			};
			store.dispatch(putUser(updatedUser)).then((result: any) => {
				if (result.error == null) {
					setErrors({ username: null });
				} else if (result.error.message.includes('409')) {
					setErrors({ username: 'Username is already in use' });
				}
			});
		}
	};

	return (
		<Box>
			<h1 className="text-3xl font-bold">Profile</h1>
			<br />
			<form onSubmit={handleSubmit}>
				<Stack direction="column" spacing={4}>
					<FormControl>
						<FormLabel htmlFor="email">Email</FormLabel>
						<Input
							type="text"
							id="email"
							name="email"
							placeholder="Email"
							value={formData.email}
							isDisabled={true}
						/>
					</FormControl>
					<FormControl isRequired isInvalid={!!errors.username}>
						<FormLabel htmlFor="username">Username</FormLabel>
						<Input
							type="text"
							id="username"
							name="username"
							placeholder="Username"
							value={formData.username}
							onChange={handleChange}
						/>
						<FormErrorMessage>{errors.username}</FormErrorMessage>
					</FormControl>

					<Button type="submit" colorScheme="blue">
						Update
					</Button>
				</Stack>
			</form>
		</Box>
	);
}

export default ProfileContainer;

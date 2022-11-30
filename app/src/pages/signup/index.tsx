import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Center, Button, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import InputText from '../../components/form/inputText';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export interface SignupFormType {
  username: string;
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(6, 'Username must be at least 6 characters')
    .max(20, 'Username must not exceed 20 characters'),
  email: Yup.string().required('Email is required').email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(40, 'Password must not exceed 40 characters')
});

const Signup: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormType>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data: SignupFormType) => {
    console.log(data);
  };

  return (
    <>
      <Helmet>
        <title>Signup - Amalanche</title>
      </Helmet>
      <Center>
        <Box width={'350px'} pt="10vh" px="3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputText id="username" label="Username" register={register} errors={errors} />
            <InputText id="email" label="Email" register={register} errors={errors} />
            <InputText
              id="password"
              label="Password"
              type="password"
              register={register}
              errors={errors}
            />
            <Button type="submit" width="full" isLoading={isSubmitting}>
              Signup
            </Button>
          </form>
        </Box>
      </Center>
    </>
  );
};

export default Signup;

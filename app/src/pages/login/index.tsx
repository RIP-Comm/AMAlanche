import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Center, Button, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import InputText from '../../components/form/inputText';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export interface LoginFormType {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password is invalid')
    .max(40, 'Password is invalid')
});

const Login: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormType>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data: LoginFormType) => {
    console.log(data);
  };

  return (
    <>
      <Helmet>
        <title>Login - Amalanche</title>
      </Helmet>
      <Center>
        <Box width={'350px'} pt="10vh" px="3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputText
              id="email"
              label="Email"
              register={register}
              errors={errors}
            />
            <InputText
              id="password"
              label="Password"
              type="password"
              register={register}
              errors={errors}
            />
            <Button
              type="submit"
              width="full"
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </form>
        </Box>
      </Center>
    </>
  );
};

export default Login;

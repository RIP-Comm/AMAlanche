import React, { useState } from 'react';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface InputTextProps {
  register: any;
  errors: any;
  id: string;
  label: string;
  type?: 'text' | 'password';
}

const InputText = ({
  register,
  errors,
  id,
  label,
  type = 'text'
}: InputTextProps) => {
  const [show, setShow] = useState<boolean>(false);
  const handleClick = () => setShow(!show);

  return (
    <FormControl isInvalid={errors[id]} mb={5}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <InputGroup size="md">
        <Input
          id={id}
          type={!show && type === 'password' ? 'password' : 'text'}
          placeholder={label}
          {...register(id)}
        />
        {type === 'password' && (
          <InputRightElement width="2.85rem">
            <IconButton
              h="1.75rem"
              size="sm"
              aria-label="Show password"
              icon={show ? <ViewIcon /> : <ViewOffIcon />}
              onClick={handleClick}
            />
          </InputRightElement>
        )}
      </InputGroup>
      <FormErrorMessage>
        {errors[id] && errors[id].message}
      </FormErrorMessage>
    </FormControl>
  );
};
export default InputText;

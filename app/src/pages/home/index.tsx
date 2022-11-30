import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Center, Heading, HStack, VStack, Link } from '@chakra-ui/react';

function Home() {
  return (
    <>
      <Helmet>
        <title>Amalanche</title>
      </Helmet>
      <Center mt="5">
        <VStack>
          <Heading>Amalanche</Heading>
          <HStack>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </HStack>
        </VStack>
      </Center>
    </>
  );
}

export default Home;

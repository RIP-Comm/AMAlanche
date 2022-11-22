import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Center, Heading } from '@chakra-ui/react';

function Home() {
  return (
    <>
      <Helmet>
        <title>AMAlanche</title>
      </Helmet>
      <Center mt="5">
        <Heading>AMAlanche</Heading>
      </Center>
    </>
  );
}

export default Home;

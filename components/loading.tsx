import {Flex, Heading, Spinner} from "@chakra-ui/react";
import React from "react";

export const Loading: React.FC = () => {
  return (
    <Flex height="100vh" flexDirection="column" alignItems="center" justifyContent="center">
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        width="100px"
        height="100px"
        mb="30px"
      />
      <Heading size="md">Preparing your gradient ...</Heading>
    </Flex>
  )
}

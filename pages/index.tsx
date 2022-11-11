import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Box, Button, Center, Flex, Heading, Input, Text} from "@chakra-ui/react";
import React, {ComponentProps} from "react";

const Card: React.FC<ComponentProps<typeof Box>> = (props) => {
  return <Box className={styles.card} {...props}/>
}

export default function Home() {
  return (
    <Box className={styles.container}>
      <Head>
        <title>My Tone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center h="100%" w="100%" px="5px">
        <Box display="flex" flexDirection="column" alignItems="center" w="100%">
          <Box color="white" textAlign="center">
            <Heading mb="10px">MY TONE</Heading>
            <Text fontWeight="bold" mb="30px">See how your music taste looks like</Text>
          </Box>
          <Card w="100%" mb="20px">
            <Text fontWeight="bold" mb="10px" color="white">1. Get a playlist from Spotify</Text>
            <Flex flexDirection="row">
              <Button size="sm" mb="10px" bg="black" color="white">Open Spotify</Button>
              <Box flex={1}/>
              <Button size="sm" mb="10px" color="white" variant="link">How to get link</Button>
            </Flex>
            <Text color="white">Be sure that your Spotify playlist is public!</Text>
          </Card>
          <Card w="100%">
            <Text fontWeight="bold" mb="10px" color="white">2. Paste your playlist link below</Text>
            <Input placeholder="Paste link here" mb="10px" bg="white"/>
            <Button w="100%" colorScheme="teal" onClick={() => {}}>See my tone!</Button>
          </Card>
        </Box>
      </Center>
    </Box>
  )
}

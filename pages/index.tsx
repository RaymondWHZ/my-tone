import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Box, Button, Center, Flex, Heading, Input, InputGroup, InputLeftElement, Text} from "@chakra-ui/react";
import React, {useMemo, useState} from "react";
import {useRouter} from "next/router";
import {AlphaCard} from "../components/cards";

const SPOTIFY_PLAYLIST_ID_LENGTH = 22

export default function Home() {
  const router = useRouter();
  const [ url, setUrl ] = useState("");
  const playlist = useMemo(() => {
    const start = url.lastIndexOf("/") + 1
    return url.substring(start, start + SPOTIFY_PLAYLIST_ID_LENGTH)
  }, [url])
  return (
    <Box className={styles.container}>
      <Head>
        <title>My Tone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center h="100%" w="100%" px="20px">
        <Box display="flex" flexDirection="column" alignItems="center" w="100%">
          <Box color="white" textAlign="center">
            <Heading mb="10px" fontSize="40px">MY <span className={styles.tone}>TONE</span></Heading>
            <Text fontWeight="bold" mb="30px">See how your music taste looks like</Text>
          </Box>
          <AlphaCard w="100%" mb="24px">
            <Text fontWeight="bold" mb="12px" color="white">1. Get a playlist from Spotify</Text>
            <Flex flexDirection="row" mb="12px" >
              <a href={"https://open.spotify.com"} target="_blank" rel="noreferrer">
                <Button bg="black" color="white" fontSize="14px">Open Spotify</Button>
              </a>
              <Box flex={1}/>
              <Button size="sm" color="white" variant="link" textDecoration="underline" fontWeight="bold">How to get link</Button>
            </Flex>
            <Text color="white">Be sure that your Spotify playlist is public!</Text>
          </AlphaCard>
          <AlphaCard w="100%">
            <Text fontWeight="bold" mb="12px" color="white">2. Paste your playlist link below</Text>
            <InputGroup>
              <InputLeftElement
                pointerEvents='none'
                children={<img alt="" src="/spotify.svg" height="20px" width="20px" />}
              />
              <Input placeholder="Paste link here" mb="12px" bg="white" value={url} onChange={e => setUrl(e.target.value)}/>
            </InputGroup>
            <Button w="100%" colorScheme="teal" onClick={() => router.push("/gradient?playlist=" + playlist)}>See my tone!</Button>
          </AlphaCard>
        </Box>
      </Center>
    </Box>
  )
}

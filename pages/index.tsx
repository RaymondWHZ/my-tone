import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
  ModalOverlay,
  Text, useDisclosure
} from "@chakra-ui/react";
import React, {useMemo, useState} from "react";
import {useRouter} from "next/router";
import {AlphaCard} from "../components/cards";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [ url, setUrl ] = useState("");
  const playlist = useMemo(() => {
    const start = url.lastIndexOf("/") + 1
    const end = url.indexOf("?", start)
    if (end == -1) {
      return url.substring(start)
    } else {
      return url.substring(start, end)
    }
  }, [url])
  const { isOpen, onOpen, onClose } = useDisclosure()
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
              <Button size="sm" color="white" variant="link" textDecoration="underline" fontWeight="bold" onClick={onOpen}>How to get link</Button>
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How to get playlist link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Accordion defaultIndex={0}>
              {["/Inst_1.jpg", "/Inst_2.jpg", "/Inst_3.jpg"].map((src, index) => (
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex='1' textAlign='left'>
                        Step {index + 1}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Image alt="" src={src} width={400} height={500} />
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>
              Got it!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

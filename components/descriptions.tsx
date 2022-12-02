import {
  Box,
  Button, Center,
  Drawer, DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Spacer,
  Text, useDisclosure
} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router";
import {WhiteCard} from "./cards";
import {
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton
} from "react-share";

export interface DisplayDescription {
  [key: string]: {
    quantifier: string
    description: string
  }
}

interface DescriptionsProps {
  descriptions: DisplayDescription
  onClickSeeSimilar?: (color: string) => void
  onClickSave?: () => void
}

const EntryScreen: React.FC<{ onShare?: () => void }> = ({ onShare }) => {
  const router = useRouter()
  return (
    <Flex h="100vh" flexDirection="column">
      <Flex flexDirection="row" mt="20px">
        <Button colorScheme='white' variant='ghost'>
          <Image
            boxSize='2.5em'
            objectFit='cover'
            src='/down_chevron_icon.svg'
            transform='rotate(270deg)'
            onClick={() => router.push("/")}
          />
        </Button>
        <Spacer/>
      </Flex>
      <Spacer/>
      <Flex flexDirection="row" justifyContent="center" mb="20px" >
        <Button colorScheme='white' variant='ghost' onClick={onShare}>
          <Image
            boxSize='2.5em'
            objectFit='cover'
            src='/share_icon.svg'
          />
        </Button>
        <Spacer/>
        <Text color='white' variant='ghost'>
          Read more
          <Image
            boxSize='40%'
            ml='1.5em'
            src='/down_chevron.svg'
          />
        </Text>
        <Spacer/>
        <Button variant='ghost'>
          <Box boxSize='2.5em' />
        </Button>
      </Flex>
    </Flex>
  )
}

export const Descriptions: React.FC<DescriptionsProps> = ({ descriptions, onClickSeeSimilar, onClickSave }) => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <EntryScreen onShare={onOpen}/>
      <Box background="rgba(255, 255, 255, 0.0)" mt="40px" mb="80px">
        {descriptions &&
          Object.keys(descriptions).map(c => {
            return (
              <WhiteCard key={c} w="100%" mb="20px" background="rgba(255, 255, 255, 1.0)">
                <Text fontWeight="bold" mb="10px" color={c}>{c.toUpperCase() + ": " + descriptions[c].quantifier}</Text>
                <Text color="black" mb="8px">{descriptions[c].description}</Text>
              </WhiteCard>)
          })
        }
        <Flex flexDirection="row" justifyContent='center'>
          <Button
            size="sm"
            bg="black"
            color="white"
            mt="10px"
            onClick={() => onClickSeeSimilar && onClickSeeSimilar("true")}
          >
            See Similar Songs
          </Button>
        </Flex>
      </Box>
      <Flex flexDirection="row" justifyContent="center" mb="20px" >
        <Button colorScheme='white' variant='ghost' onClick={onOpen}>
          <Image
            boxSize='2.5em'
            objectFit='cover'
            src='/share_icon.svg'
          />
        </Button>
        <Spacer/>
        <Button colorScheme='white' variant='ghost'>
          <Image
            width='2.5em'
            objectFit='cover'
            src='/refresh_iconsvg.svg'
            onClick={() => router.push("/")}
          />
        </Button>
        <Spacer/>
        <Button variant='ghost'>
          <Box boxSize='2.5em' />
        </Button>
      </Flex>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Share your gradient</DrawerHeader>
          <DrawerBody pt="20px" pb="80px">
            <Flex flexDirection="row">
              <Center bg="black" mr="20px">
                <Image src="/file_download.svg" onClick={onClickSave} />
              </Center>
              <Center mr="20px">
                <FacebookShareButton
                  url={"https://mytone.cc/gradient?playlist=2n4aN8bbWVPiMA2MPMOW1t"}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              </Center>
              <Center mr="20px">
                <TwitterShareButton
                  url={window.location.href}
                  title={"Check out my gradient!"}
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
              </Center>
              <Center mr="20px">
                <RedditShareButton
                  url={window.location.href}
                  title={"Check out my gradient!"}
                >
                  <RedditIcon size={32} round />
                </RedditShareButton>
              </Center>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

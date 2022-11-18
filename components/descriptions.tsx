import {Box, Button, Flex, Image, Spacer, Text} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router";
import {WhiteCard} from "./cards";

export interface DisplayDescription {
  [key: string]: {
    quantifier: string
    description: string
  }
}

interface DescriptionsProps {
  descriptions: DisplayDescription
  onClickSeeSimilar?: (color: string) => void
}

export const Descriptions: React.FC<DescriptionsProps> = ({ descriptions, onClickSeeSimilar }) => {
  const router = useRouter()
  return (
    <>
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
          <Button colorScheme='white' variant='ghost'>
            <Image
              boxSize='2.5em'
              objectFit='cover'
              src='/share_icon.svg'
            />
          </Button>
          <Spacer/>
          <Button colorScheme='white' variant='ghost'>
            <Image
              boxSize='2.5em'
              objectFit='cover'
              src='/down_chevron_icon.svg'
            />
          </Button>
          <Spacer/>
          <Box boxSize='2.5em' />
        </Flex>
      </Flex>
      <Box background="rgba(255, 255, 255, 0.0)">
        {descriptions &&
          Object.keys(descriptions).map(c => {
            return (
              <WhiteCard w="100%" mb="20px" background="rgba(255, 255, 255, 1.0)">
                <Text fontWeight="bold" mb="10px" color={c}>{c.toUpperCase() + ": " + descriptions[c].quantifier}</Text>
                <Text color="black" mb="20px">{descriptions[c].description}</Text>
                <Flex flexDirection="row" justifyContent='center'>
                  <Button
                    size="sm"
                    mb="10px"
                    bg="black"
                    color="white"
                    onClick={() => onClickSeeSimilar && onClickSeeSimilar(c)}
                  >
                    See Similar
                  </Button>
                </Flex>
              </WhiteCard>)
          })
        }
      </Box>
      <Flex flexDirection="row" justifyContent="center" mb="20px" >
        <Button colorScheme='white' variant='ghost'>
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
            height='2.5em'
            objectFit='cover'
            src='/refresh_iconsvg.svg'
            onClick={() => router.push("/")}
          />
        </Button>
        <Spacer/>
        <Box boxSize='2.5em' />
      </Flex>
    </>
  )
}

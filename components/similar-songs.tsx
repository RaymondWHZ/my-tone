import React from "react";
import {Button, Flex, Image, Spacer, Box, Text} from "@chakra-ui/react";
import { WhiteCard } from "./cards";

interface SimilarSongsProps {
  onClickReturn?: () => void
}

export const SimilarSongs: React.FC<SimilarSongsProps> = ({ onClickReturn }) => {
  return (
    <>
      <Flex flexDirection="row" mt="20px">
        <Button colorScheme='white' variant='ghost'>
          <Image
            boxSize='2.5em'
            objectFit='cover'
            src='/down_chevron_icon.svg'
            transform='rotate(270deg)'
            onClick={onClickReturn}
          />
        </Button>
        <Spacer/>
      </Flex>

      <Flex background="rgba(255, 255, 255, 0.0)" flexDirection='row' mb="20px" mt="40px">
        <Image
          boxSize='10em'
          objectFit='cover'
          src='/album_art1.jpeg'
          borderRadius="20px"
        />
        <WhiteCard width='prose' alignContent="left" justifyContent="center" ml="20px">
          <Text fontWeight="bold" mb="10px" color="black">Comfortably Numb</Text>
          <Text color="black" mb="20px"> artist: Pink Floyd</Text>
        </WhiteCard>
      </Flex>

      <Flex background="rgba(255, 255, 255, 0.0)" flexDirection='row' mb="20px">
        <Image
          boxSize='10em'
          objectFit='cover'
          src='/album_art2.jpeg'
          borderRadius="20px"
        />
        <WhiteCard width='prose' alignContent="left" justifyContent="center" ml="20px">
          <Text fontWeight="bold" mb="10px" color="black">Come Together</Text>
          <Text color="black" mb="20px"> artist: The Beatles</Text>
        </WhiteCard>
      </Flex>

      <Flex background="rgba(255, 255, 255, 0.0)" flexDirection='row' mb="20px">
        <Image
          boxSize='10em'
          objectFit='cover'
          src='/album_art3.jpeg'
          borderRadius="20px"
        />
        <WhiteCard width='prose' alignContent="left" justifyContent="center" ml="20px">
          <Text fontWeight="bold" mb="10px" color="black">Kashmir</Text>
          <Text color="black" mb="20px"> artist: Led Zeppelin</Text>
        </WhiteCard>
      </Flex>
      
    </>
  )
}

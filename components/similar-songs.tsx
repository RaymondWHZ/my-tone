import React from "react";
import {Button, Flex, Image, Spacer} from "@chakra-ui/react";

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
      <h2>Related Songs</h2>
    </>
  )
}

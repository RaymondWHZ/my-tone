import React, {useEffect, useState} from "react";
import {Button, Flex, Image, Spacer, Text} from "@chakra-ui/react";
import { WhiteCard } from "./cards";
import {useRouter} from "next/router";
import {Song} from "../types/types";

interface SimilarSongsProps {
  onClickReturn?: () => void
}

const useSimilarSongs = (playlist: string | undefined) => {
  const [response, setResponse] = useState<any>(undefined);
  useEffect(() => {  // executes once on page load
    if (playlist !== undefined) {
      fetch("/api/similar-songs?playlist=" + playlist)
        .then(async res => {
          setResponse(await res.json())
        })
    }
  }, [playlist])

  return {
    loading: !response,
    error: response?.error,
    songs: response?.data.songs,
  }
}

export const SimilarSongs: React.FC<SimilarSongsProps> = ({ onClickReturn }) => {
  const router = useRouter()
  const playlist = router.query.playlist as string | undefined
  const { songs } = useSimilarSongs(playlist)
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
      {!songs && <Text>loading...</Text>}
      {songs && songs.map((song: Song) => (
        <Flex background="rgba(255, 255, 255, 0.0)" flexDirection='row' mb="20px" mt="40px">
          <Image
            boxSize='10em'
            objectFit='cover'
            src={song.image}
            borderRadius="20px"
          />
          <WhiteCard width='prose' alignContent="left" justifyContent="center" ml="20px">
            <Text fontWeight="bold" mb="10px" color="black">{song.name}</Text>
          </WhiteCard>
        </Flex>
      ))}
    </>
  )
}

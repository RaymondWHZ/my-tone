import {Box, Flex, Text, Button, Spacer, Image} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import React, {ComponentProps, useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";

const Card: React.FC<ComponentProps<typeof Box>> = (props) => {
  return <Box className={styles.card} {...props}/>
}

interface Color {
  [key: string]: number
}

interface ColorDescription {
  high: string
  medium: string
  low: string
  varied: string
  uniform: string
}

interface ColorDescriptionDict {
  [key: string]: ColorDescription
}

interface DisplayDescription {
  [key: string]: {
    quantifier: string
    description: string
  }
}

// Generate descriptions of the generated colors
const generateDescriptions = (color1: Color, color2: Color) => {
  // params:
  // color1: {red: 123, green: 123, blue: 123}
  // color2: {red: 123, green: 123, blue: 123}

  // constants:
  // const color_attribute_map = {
  //   red: ["energy", "liveliness", "loudness", "valence"],
  //   green: ["acousticness", "instrumentalness", "speechiness", "danceability"],
  //   blue: ["mode", "tempo", "time_signature", "key"]
  // }

  // templates
  const colorDescriptionTemplates: ColorDescriptionDict = {
    red: {
      high: "Overall, your playlist is lively, energetic, and loud. The average mood is cheerful and positive. ",
      medium: "Overall, your playlist has some aspects of being lively, energetic and loud. The average mood is balanced, but still positive. ",
      low: "Overall, your playlist is less energetic, lively, or loud than others. The average mood may tend to be more sad, and less upbeat. ",
      varied: "Individual songs in your playlist can vary in their liveliness and mood.",
      uniform: "Most songs in your playlist have similar liveniness and mood."
    },
    green: {
      high: "Your playlist has high acousticness and instrumentalness. It has lots of vocals and is easy to dance to. ",
      medium: "Your playlist has some aspects of acousticness and instrumentalness. It has an average amount of vocals and is moderately easy to dance to. " ,
      low: "Your playlist is low on acousticness and instrumentalness. It has less vocals and low danceability on average. ",
      varied: "Each song in your playlist varies in acousticness, instrumentalness, amount of vocals, and danceability.",
      uniform: "Songs in your playlist are similar in acousticness, instrumentalness, amount of vocals, and danceability."
    },
    blue: {
      high: "Songs on your playlist have standard tempos, time signatures, and keys. ",
      medium: "Some songs on your playlist have standard tempos, time signatures, and keys. ",
      low: "Most songs on your playlist have tempos, time signatures, and keys that are uncommon. ",
      varied: "There is high variation in time signatures and keys between songs.",
      uniform: "There is little variation in time signatures and keys between songs."
    }
  };

  // Thresholds (adjust)
  const highThreshold = 200;
  const mediumThreshold = 100;
  const variedThreshold = 80;

  const descriptions: any = {};
  Object.keys(colorDescriptionTemplates).forEach(c => {
    let quant: string = "";
    let desc: string = "";
    if (color1[c] > highThreshold || color2[c] > highThreshold) {
      quant += "High and ";
      desc += colorDescriptionTemplates[c].high;
    } else if (color1[c] > mediumThreshold || color2[c] > mediumThreshold) {
      quant += "Medium and ";
      desc += colorDescriptionTemplates[c].medium;
    } else {
      quant += "Low and ";
      desc += colorDescriptionTemplates[c].low;
    }

    if (Math.abs(color1[c] - color2[c]) > variedThreshold) {
      quant += "Varied";
      desc += colorDescriptionTemplates[c].varied;
    } else {
      quant += "Uniform";
      desc += colorDescriptionTemplates[c].uniform;
    }
    descriptions[c] = {quantifier:  quant, description: desc};
  });
  return descriptions
}

const getSampleDescriptions = () => {
  return generateDescriptions({red: 225, green: 120, blue: 40}, {red: 80, green: 100, blue: 30});
}

const useGradientAndDescription = (playlist: string) => {
  const [response, setResponse] = useState<any>(undefined);
  useEffect(() => {  // executes once on page load
    fetch("/api/gradient?playlist=" + playlist)
      .then(async res => {
        setResponse(await res.json())
      })
  }, [])

  const descriptions: DisplayDescription | undefined = useMemo(() => {
    return getSampleDescriptions()
  }, [response])

  return {
    loading: !response,
    error: response?.error,
    gradient: response?.gradient,
    descriptions
  }
}

export default function Gradient() {
  const router = useRouter()
  const { playlist } = router.query
  const { loading, error, descriptions } = useGradientAndDescription(playlist as string)

  if (loading) {  // loading
    return (
      <Box className={styles.container}>
        Loading...
      </Box>
    )
  }

  if (error) {  // error
    return (
      <Box className={styles.container}>
        Error: {error}
      </Box>
    )
  }

  return (
    <>
      <Box className={styles.gradient} />
      <Box className={styles.description_container}>
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
            Object.keys(descriptions).map( c => {
              return (
              <Card w="100%" mb="20px" background="rgba(255, 255, 255, 1.0)">
                <Text fontWeight="bold" mb="10px" color={c}>{c.toUpperCase() + ": " + descriptions[c].quantifier}</Text>
                <Text color="black" mb="20px">{descriptions[c].description}</Text>
                <Flex flexDirection="row" justifyContent='center'>
                  <Button size="sm" mb="10px" bg="black" color="white">See Similar</Button>
                </Flex>
              </Card>)
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
      </Box>
    </>
  )
}

import {Box} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import React, {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import {Descriptions, DisplayDescription} from "../components/descriptions";
import {SimilarSongs} from "../components/similar-songs";
import {Loading} from "../components/loading";
import {GradientCanvas} from "../components/gradientCanvas"
import {Error} from "../components/error";
import {Color, ColorDescriptionDict} from "../types/types";

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
      high: "The songs in your playlist have high tempos, time signatures, and keys. ",
      medium: "Some songs on your playlist have relatively average tempos, time signatures, and keys. ",
      low: "The songs in your playlists have a lower tempo, time signature and key. ",
      varied: "The tempos, time signature, and keys are highly varied between songs in your playlist.",
      uniform: "The tempos, time signatures, and keys of the songs in your playlist are relatively similar and consistent throughout."
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

const useGradientAndDescription = (playlist: string | undefined) => {
  const [response, setResponse] = useState<any>(undefined);
  useEffect(() => {  // executes once on page load
    if (playlist !== undefined) {
      fetch("/api/gradient?playlist=" + playlist)
        .then(async res => {
          setResponse(await res.json())
        })
    }
  }, [playlist])

  const descriptions: DisplayDescription | undefined = useMemo(() => {
    return getSampleDescriptions()
  }, [response])

  return {
    loading: !response,
    error: response?.error,
    colorPoints: response?.data.color_points,
    descriptions
  }
}

export default function Gradient() {
  const router = useRouter()
  const playlist = router.query.playlist as string | undefined
  const { loading, error, colorPoints, descriptions } = useGradientAndDescription(playlist)
  const [similarSongs, setSimilarSongs] = useState<string | undefined>(undefined);
  const [saveCanvas, setSaveCanvas] = useState<boolean>(false);

  if (loading) {  // loading
    return (
      <Loading/>
    )
  }

  if (error) {  // error
    return (
      <Error/>
    )
  }

  return (
    <>
      {/* <GradientBackground colorPoints={colorPoints} /> */}
      <GradientCanvas colorPoints={colorPoints} saveCanvas={saveCanvas}/>
      <Box className={styles.description_container}>
        {!similarSongs ?
          <Descriptions
            descriptions={descriptions ?? {}}
            onClickSeeSimilar={setSimilarSongs}
            onClickSave={() => {
              setSaveCanvas(true)
              setTimeout(() => setSaveCanvas(false), 500)
            }}
          /> :
          <SimilarSongs onClickReturn={() => setSimilarSongs(undefined)}/>
        }
      </Box>
    </>
  )
}

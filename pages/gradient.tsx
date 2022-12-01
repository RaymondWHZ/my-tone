import {Box} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import React, {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import {Descriptions, DisplayDescription} from "../components/descriptions";
import {SimilarSongs} from "../components/similar-songs";
import {Loading} from "../components/loading";
import {GradientCanvas} from "../components/gradientCanvas"
import {Error} from "../components/error";

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

  // const descriptions: DisplayDescription | undefined = useMemo(() => {
  //   return getSampleDescriptions()
  // }, [response])

  console.log("Descriptions from api:");
  console.log(response?.data.description);

  return {
    loading: !response,
    error: response?.error,
    colorPoints: response?.data.color_points,
    descriptions: response?.data.description
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

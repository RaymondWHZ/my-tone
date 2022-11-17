import {Box} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";

export default function Gradient() {
  const router = useRouter()
  const { playlist } = router.query

  const [response, setResponse] = useState<any>(undefined);
  useEffect(() => {  // executes once on page load
    fetch("/api/gradient?playlist=" + playlist)
      .then(async res => setResponse(await res.json()))
  }, [])

  if (!response) {  // loading
    return (
      <Box className={styles.container}>
        Loading...
      </Box>
    )
  }
  if (response.error) {  // error
    return (
      <Box className={styles.container}>
        Error: {response.error}
      </Box>
    )
  }
  return (
    <Box className={styles.container}>
      Gradient {response.data.color}
    </Box>
  )
}

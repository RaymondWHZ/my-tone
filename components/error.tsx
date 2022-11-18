import {Box, Button, Flex, Heading, Text} from "@chakra-ui/react";
import React from "react";
import {useRouter} from "next/router";

export const Error = () => {
  const router = useRouter()
  return (
    <Flex height="100vh" flexDirection="column" alignItems="center" justifyContent="center">
      <Box textAlign="left" mb="30px">
        <Heading size="lg" mb="20px">Something went wrong!</Heading>
        <Text ml="20px">
          Please check the following:
          <ul style={{ marginTop: "10px" }}>
            <li>The link is shared from Spotify</li>
            <li>The link points to a public playlist</li>
            <li>The link is pasted in entirety</li>
          </ul>
        </Text>
      </Box>
      <Button onClick={() => router.push("/")}>
        Back
      </Button>
    </Flex>
  )
}

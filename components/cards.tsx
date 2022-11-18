import React, {ComponentProps} from "react";
import {Box} from "@chakra-ui/react";

export const WhiteCard: React.FC<ComponentProps<typeof Box>> = (props) => {
  return <Box background="rgba(255, 255, 255, 1.0)" borderRadius="5px" p="16px" {...props}/>
}

export const AlphaCard: React.FC<ComponentProps<typeof Box>> = (props) => {
  return <Box background="rgba(255, 255, 255, 0.37)" borderRadius="5px" p="16px" {...props}/>
}

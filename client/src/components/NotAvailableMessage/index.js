import { Box, Text } from "grommet";
import React from "react";

import StyledText from "./styles";

const NotAvailableMessage = ({ text, ...rest }) => (
  <Box {...rest}>
    <Text as="p">
      <StyledText>{text}</StyledText>
    </Text>
  </Box>
);

export default NotAvailableMessage;

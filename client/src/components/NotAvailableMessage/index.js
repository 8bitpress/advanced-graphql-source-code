import { Box } from "grommet";
import React from "react";

import StyledText from "./styles";

const NotAvailableMessage = ({ text, ...rest }) => (
  <Box {...rest}>
    <p>
      <StyledText>{text}</StyledText>
    </p>
  </Box>
);

export default NotAvailableMessage;

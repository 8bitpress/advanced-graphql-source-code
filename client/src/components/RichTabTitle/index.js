import { Box, Text } from "grommet";
import React from "react";

const RichTabTitle = ({ icon, label }) => (
  <Box direction="row" align="center" gap="xsmall" margin="xsmall">
    {icon}
    <Text margin={{ left: "xsmall" }} size="large" style={{ fontWeight: 600 }}>
      {label}
    </Text>
  </Box>
);

export default RichTabTitle;

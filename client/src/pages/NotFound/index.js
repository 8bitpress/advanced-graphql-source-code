import { Box, Heading } from "grommet";
import React from "react";

import MainLayout from "../../layouts/MainLayout";

const NotFound = () => (
  <MainLayout centered>
    <Box align="center" justify="center">
      <Heading level="2">Sorry! That page cannot be found.</Heading>
    </Box>
  </MainLayout>
);

export default NotFound;

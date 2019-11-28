import { Anchor, Box, Heading } from "grommet";
import React from "react";

const NavBar = () => {
  return (
    <header>
      <Box
        align="center"
        border={{
          color: "light-4",
          size: "xsmall",
          style: "solid",
          side: "bottom"
        }}
        direction="row"
        justify="between"
        pad="small"
      >
        <Heading color="brand" level="1" size="32px">
          <Anchor href="/" label="devchirps" primary />
        </Heading>
      </Box>
    </header>
  );
};

export default NavBar;

import { Refresh } from "grommet-icons";
import React from "react";

import StyledLoader from "./styles";

const Loader = ({ centered, color, size }) => (
  <StyledLoader centered={centered}>
    <Refresh color={color} size={size} />
  </StyledLoader>
);

Loader.defaultProps = {
  centered: false,
  color: "brand",
  size: "large"
};

export default Loader;

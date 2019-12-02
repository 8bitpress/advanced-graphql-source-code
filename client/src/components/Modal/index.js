import { Box, Heading, Layer } from "grommet";
import { Close } from "grommet-icons";
import React from "react";

const Modal = ({ children, handleClose, isOpen, title, width }) => (
  <Box align="center" justify="center">
    {isOpen && (
      <Layer onEsc={handleClose} onClickOutside={handleClose}>
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
          <Heading level="2" size="1.5rem">
            {title}
          </Heading>
          {handleClose && (
            <Close
              color="brand"
              onClick={handleClose}
              style={{ cursor: "pointer" }}
            />
          )}
        </Box>
        <Box pad="small" gap="small" width={width}>
          {children}
        </Box>
      </Layer>
    )}
  </Box>
);

Modal.defaultProps = {
  handleClose: null,
  isOpen: false,
  title: null,
  width: "medium"
};

export default Modal;

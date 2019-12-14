import { Anchor, Box, Text } from "grommet";
import { Book, Code } from "grommet-icons";
import React from "react";

import HoverBox from "../HoverBox";

const PinnedItemListItem = ({ pinnedItemData }) => {
  const { description, name, primaryLanguage, url } = pinnedItemData;
  const isRepo = primaryLanguage;

  return (
    <HoverBox
      border={{
        color: "light-4",
        size: "xsmall",
        style: "solid",
        side: "bottom"
      }}
      direction="row"
      pad={{ horizontal: "small", vertical: "medium" }}
    >
      <Box
        align="center"
        background={primaryLanguage ? "accent-2" : "accent-4"}
        height="48px"
        justify="center"
        margin={{ right: "medium" }}
        overflow="hidden"
        round="full"
        width="48px"
      >
        {isRepo ? <Book color="white" /> : <Code color="white" />}
      </Box>
      <Box flex>
        <Text as="p" margin={{ bottom: "small" }} weight="bold">
          <Anchor href={url}> {name}</Anchor>
        </Text>
        {description && (
          <Text as="p" margin={{ bottom: "xsmall" }}>
            {description}
          </Text>
        )}
        {isRepo && (
          <Text as="p" color="dark-4">
            {primaryLanguage}
          </Text>
        )}
      </Box>
    </HoverBox>
  );
};

export default PinnedItemListItem;

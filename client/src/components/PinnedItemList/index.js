import { Box } from "grommet";
import React from "react";

import PinnedItemListItem from "../PinnedItemListItem";

const PinnedItemList = ({ pinnedItemsData }) => {
  return (
    <Box>
      {pinnedItemsData.map(pinnedItemData => (
        <PinnedItemListItem
          pinnedItemData={pinnedItemData}
          key={pinnedItemData.id}
        />
      ))}
    </Box>
  );
};

export default PinnedItemList;

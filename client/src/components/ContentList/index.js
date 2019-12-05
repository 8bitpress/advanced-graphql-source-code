import { Box } from "grommet";
import React from "react";

import ContentListItem from "../ContentListItem";

const ContentList = ({ contentData }) => (
  <Box>
    {contentData.map(itemContentData => (
      <ContentListItem
        contentData={itemContentData.node}
        key={itemContentData.node.id}
      />
    ))}
  </Box>
);

export default ContentList;

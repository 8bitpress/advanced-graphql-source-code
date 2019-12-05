import { Box } from "grommet";
import React from "react";

import ProfileListItem from "../ProfileListItem";

const ProfileList = ({ profileData }) => (
  <Box>
    {profileData.map(itemProfileData => (
      <ProfileListItem
        profileData={itemProfileData.node}
        key={itemProfileData.node.id}
      />
    ))}
  </Box>
);

export default ProfileList;

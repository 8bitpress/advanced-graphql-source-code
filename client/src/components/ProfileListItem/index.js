import { Anchor, Box, Button, Image, Text } from "grommet";
import { Link } from "react-router-dom";
import React from "react";

const ProfileListItem = ({ profileData }) => {
  const { avatar, description, fullName, username } = profileData;

  return (
    <Box
      border={{
        color: "light-4",
        size: "xsmall",
        style: "solid",
        side: "bottom"
      }}
      direction="row"
      pad={{ left: "small", top: "medium", right: "small" }}
    >
      <Box
        height="48px"
        margin={{ right: "medium" }}
        overflow="hidden"
        round="full"
        width="48px"
      >
        <Image fit="cover" src={avatar} alt={`${fullName} profile image`} />
      </Box>
      <Box flex={{ grow: 1, shrink: 0 }} margin={{ bottom: "medium" }}>
        <Text as="p">
          <Text weight="bold">{fullName}</Text>{" "}
          <Link to={`/profile/${username}`}>
            <Anchor color="dark-4" as="span">
              @{username}
            </Anchor>
          </Link>
        </Text>
        <Text as="p" margin={{ bottom: "small", top: "small" }}>
          {description}
        </Text>
      </Box>
      <Box>
        <Button label="Unfollow" onClick={() => console.log("Clicked")} />
      </Box>
    </Box>
  );
};

export default ProfileListItem;

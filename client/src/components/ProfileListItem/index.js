import { Anchor, Box, Button, Image, Text } from "grommet";
import { Link, withRouter } from "react-router-dom";
import React from "react";

import HoverBox from "../HoverBox";

const ProfileListItem = ({ history, profileData }) => {
  const { avatar, description, fullName, username } = profileData;

  return (
    <HoverBox
      border={{
        color: "light-4",
        size: "xsmall",
        style: "solid",
        side: "bottom"
      }}
      direction="row"
      onClick={() => {
        history.push(`/profile/${username}`);
      }}
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
        <Box onClick={event => event.stopPropagation()}>
          <Button label="Unfollow" onClick={() => console.log("Clicked")} />
        </Box>
      </Box>
    </HoverBox>
  );
};

export default withRouter(ProfileListItem);

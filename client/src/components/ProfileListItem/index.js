import { Anchor, Box, Button, Image, Text } from "grommet";
import { Link, withRouter } from "react-router-dom";
import { useMutation } from "@apollo/client";
import React from "react";
import queryString from "query-string";

import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from "../../graphql/mutations";
import {
  updateProfileContentFollowing,
  updateSearchProfilesFollowing
} from "../../lib/updateQueries";
import { useAuth } from "../../context/AuthContext";
import HoverBox from "../HoverBox";

const ProfileListItem = ({ history, location, match, profileData }) => {
  const {
    avatar,
    description,
    fullName,
    id,
    username,
    viewerIsFollowing
  } = profileData;

  const {
    viewerQuery: {
      data: { viewer }
    }
  } = useAuth();

  const update = cache => {
    if (match.params.username) {
      updateProfileContentFollowing(cache, id, match.params.username);
    } else if (location.pathname === "/search/") {
      const { text } = queryString.parse(location.search);
      updateSearchProfilesFollowing(cache, id, text);
    }
  };
  const [followProfile, { loading }] = useMutation(FOLLOW_PROFILE, { update });
  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE, { update });

  const variables = {
    data: {
      followingProfileId: id
    },
    where: {
      username: viewer.profile.username
    }
  };

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
      {viewer.profile.username !== username && (
        <Box onClick={event => event.stopPropagation()}>
          <Button
            disabled={loading}
            label={viewerIsFollowing ? "Unfollow" : "Follow"}
            onClick={() => {
              if (viewerIsFollowing) {
                unfollowProfile({ variables });
              } else {
                followProfile({ variables });
              }
            }}
            primary={!viewerIsFollowing}
          />
        </Box>
      )}
    </HoverBox>
  );
};

export default withRouter(ProfileListItem);

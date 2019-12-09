import { Box, Button, Heading, Image, Text } from "grommet";
import { useMutation } from "@apollo/client";
import { withRouter } from "react-router-dom";
import moment from "moment";
import React from "react";

import { useAuth } from "../../context/AuthContext";
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from "../../graphql/mutations";

const ProfileHeader = ({ history, profileData, refetchProfile }) => {
  const {
    account,
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
  const [followProfile, { loading }] = useMutation(FOLLOW_PROFILE);
  const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE);

  const variables = {
    data: {
      followingProfileId: id
    },
    where: {
      username: viewer.profile.username
    }
  };

  const renderButton = () => {
    let label, onClick;

    if (username === viewer.profile.username) {
      label = "Edit Profile";
      onClick = () => {
        history.push("/settings/profile");
      };
    } else if (viewerIsFollowing) {
      label = "Unfollow";
      onClick = async () => {
        await unfollowProfile({ variables });
        refetchProfile();
      };
    } else {
      label = "Follow";
      onClick = async () => {
        await followProfile({ variables });
        refetchProfile();
      };
    }

    return (
      <Button disabled={loading} label={label} onClick={onClick} primary />
    );
  };

  return (
    <Box
      align="center"
      border={{ color: "accent-3", size: "medium" }}
      direction="row-responsive"
      pad="medium"
    >
      <Box
        alignSelf="start"
        border={{ color: "brand", size: "small" }}
        height="xsmall"
        margin={{ bottom: "small", right: "medium" }}
        overflow="hidden"
        round="full"
        width="xsmall"
      >
        <Image fit="cover" src={avatar} alt={`${fullName} profile image`} />
      </Box>
      <Box basis="1/2" flex={{ grow: 1, shrink: 0 }}>
        {fullName && <Heading level="2">{fullName}</Heading>}
        <Text as="p" color="dark-3" margin={{ bottom: "medium" }}>
          @{username} {account.isModerator && "(Moderator)"}
        </Text>
        <Text as="p" margin={{ bottom: "small" }}>
          {description ? description : "404: description not found."}
        </Text>
        <Text as="p" margin={{ bottom: "small" }}>
          Joined {moment(account.createdAt).format("MMMM YYYY")}
        </Text>
      </Box>
      <Box alignSelf="start">{renderButton()}</Box>
    </Box>
  );
};

export default withRouter(ProfileHeader);

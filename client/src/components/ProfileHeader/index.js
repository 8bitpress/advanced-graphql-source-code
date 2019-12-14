import { Anchor, Box, Button, Heading, Image, Text } from "grommet";
import { Github } from "grommet-icons";
import { useMutation } from "@apollo/client";
import { withRouter } from "react-router-dom";
import moment from "moment";
import React from "react";

import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from "../../graphql/mutations";
import { useAuth } from "../../context/AuthContext";
import AccountBlockButton from "../AccountBlockButton";
import ModeratorRoleButton from "../ModeratorRoleButton";
import NotAvailableMessage from "../NotAvailableMessage";

const ProfileHeader = ({ history, profileData, refetchProfile }) => {
  const {
    account,
    avatar,
    description,
    fullName,
    githubUrl,
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
        <Box align="center" direction="row" margin={{ bottom: "medium" }}>
          <Text as="p" color="dark-3">
            @{username} {account.isModerator && "(Moderator)"}
          </Text>
          {githubUrl && (
            <Anchor href={githubUrl} margin={{ left: "xsmall" }}>
              <Github color="brand" size="20px" />
            </Anchor>
          )}
        </Box>
        {account.isBlocked && (
          <NotAvailableMessage
            margin={{ bottom: "medium" }}
            text="This account has been temporarily suspended."
          />
        )}
        <Text as="p" margin={{ bottom: "small" }}>
          {description ? description : "404: description not found."}
        </Text>

        <Box align="center" direction="row" margin={{ bottom: "small" }}>
          <Text as="p" margin={{ right: "xsmall" }}>
            Joined {moment(account.createdAt).format("MMMM YYYY")}
          </Text>
          {viewer.isModerator && username !== viewer.profile.username && (
            <AccountBlockButton
              accountId={account.id}
              iconSize="18px"
              isBlocked={account.isBlocked}
            />
          )}
          {viewer.isModerator && (
            <ModeratorRoleButton
              accountId={account.id}
              iconSize="18px"
              isModerator={account.isModerator}
            />
          )}
        </Box>
      </Box>
      <Box alignSelf="start">{renderButton()}</Box>
    </Box>
  );
};

export default withRouter(ProfileHeader);

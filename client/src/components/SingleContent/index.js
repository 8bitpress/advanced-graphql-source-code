import { Anchor, Box, Image, Text } from "grommet";
import { Link } from "react-router-dom";
import React from "react";

import { displayFullDatetime } from "../../lib/displayDatetime";
import { useAuth } from "../../context/AuthContext";
import NotAvailableMessage from "../NotAvailableMessage";

const SingleContent = ({ contentData }) => {
  const {
    viewerQuery: {
      data: { viewer }
    }
  } = useAuth();

  const { author, createdAt, isBlocked, text } = contentData;

  return (
    <Box
      border={{
        color: "light-4",
        size: "xsmall",
        style: "solid",
        side: "bottom"
      }}
      margin={{ top: "medium" }}
      pad={{ bottom: "large" }}
    >
      <Box direction="row">
        <Box
          height="xsmall"
          margin={{ right: "medium" }}
          overflow="hidden"
          round="full"
          width="xsmall"
        >
          <Image
            fit="cover"
            src={author.avatar}
            alt={`${author.fullName} profile image`}
          />
        </Box>
        <Box justify="center">
          <Text weight="bold">{author.fullName}</Text>
          <Text as="p">
            <Link to={`/profile/${author.username}`}>
              <Anchor color="dark-4" as="span">
                @{author.username}
              </Anchor>
            </Link>
          </Text>
        </Box>
      </Box>
      <Box margin={{ top: "small" }}>
        {isBlocked && (
          <NotAvailableMessage
            margin={{ bottom: "small", top: "xsmall" }}
            text="This content was blocked by a moderator."
          />
        )}
        {(!isBlocked || author.username === viewer.profile.username) && (
          <Text as="p" size="xlarge">
            {text}
          </Text>
        )}
      </Box>
      <Box align="center" direction="row" margin={{ top: "small" }}>
        <Text as="p" color="dark-3" size="small">
          {displayFullDatetime(createdAt)}
        </Text>
      </Box>
    </Box>
  );
};

export default SingleContent;

import { Anchor, Box, Image, Text } from "grommet";
import { Link, withRouter } from "react-router-dom";
import React from "react";

import { displayRelativeDateOrTime } from "../../lib/displayDatetime";
import { useAuth } from "../../context/AuthContext";
import HoverBox from "../HoverBox";
import NewReplyModal from "../NewReplyModal";
import NotAvailableMessage from "../NotAvailableMessage";

const ContentListItem = ({ contentData, history }) => {
  const {
    viewerQuery: {
      data: { viewer }
    }
  } = useAuth();

  const {
    author,
    createdAt,
    id,
    isBlocked,
    postAuthor: parentPostAuthor,
    text
  } = contentData;

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
        history.push(
          `/${parentPostAuthor !== undefined ? "reply" : "post"}/${id}`
        );
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
        <Image
          fit="cover"
          src={author.avatar}
          alt={`${author.fullName} profile image`}
        />
      </Box>
      <Box flex margin={{ bottom: "medium" }}>
        <Text as="p">
          <Text weight="bold">{author.fullName}</Text>{" "}
          <Link to={`/profile/${author.username}`}>
            <Anchor color="dark-4" as="span">
              @{author.username}
            </Anchor>
          </Link>
        </Text>
        {parentPostAuthor && (
          <Text as="p">
            <Text color="dark-3">Replying to </Text>
            <Link to={`/profile/${parentPostAuthor.username}`}>
              <Anchor as="span">@{parentPostAuthor.username}</Anchor>
            </Link>
          </Text>
        )}
        {isBlocked && (
          <NotAvailableMessage
            margin={{ top: "small" }}
            text="This content was blocked by a moderator."
          />
        )}
        {(!isBlocked || author.username === viewer.profile.username) && (
          <Text as="p" margin={{ top: "small" }}>
            {text}
          </Text>
        )}
        <Box align="center" direction="row" margin={{ top: "small" }}>
          <Text as="p" color="dark-3" size="small" margin={{ right: "small" }}>
            {displayRelativeDateOrTime(createdAt)}
          </Text>
          {parentPostAuthor === undefined && !isBlocked && (
            <NewReplyModal
              iconSize="18px"
              postData={{ author, createdAt, id, text }}
              showButtonLabel={false}
            />
          )}
        </Box>
      </Box>
    </HoverBox>
  );
};

export default withRouter(ContentListItem);

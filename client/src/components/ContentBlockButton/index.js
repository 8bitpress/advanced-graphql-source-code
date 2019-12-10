import { Button } from "grommet";
import { Halt } from "grommet-icons";
import { useMutation } from "@apollo/client";
import React from "react";

import { TOGGLE_POST_BLOCK, TOGGLE_REPLY_BLOCK } from "../../graphql/mutations";

const ContentBlockButton = ({ iconSize, id, isBlocked, isReply }) => {
  const [togglePostBlock, { loading }] = useMutation(TOGGLE_POST_BLOCK);
  const [toggleReplyBlock] = useMutation(TOGGLE_REPLY_BLOCK);

  return (
    <Button
      a11yTitle={`Block ${isReply ? "Reply" : "Post"}`}
      disabled={loading}
      icon={
        <Halt
          color={isBlocked ? "status-critical" : "dark-4"}
          size={iconSize}
        />
      }
      onClick={() => {
        if (isReply) {
          toggleReplyBlock({ variables: { where: { id } } });
        } else {
          togglePostBlock({ variables: { where: { id } } });
        }
      }}
    />
  );
};

ContentBlockButton.defaultProps = {
  iconSize: "small",
  isReply: false
};

export default ContentBlockButton;

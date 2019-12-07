import { Anchor, Button, Box, Image, Text } from "grommet";
import { ChatOption } from "grommet-icons";
import { Link } from "react-router-dom";
import React, { useState } from "react";

import { displayRelativeDateOrTime } from "../../lib/displayDatetime";
import CreateContentForm from "../CreateContentForm";
import Modal from "../Modal";

const NewReplyModal = ({ iconSize, postData, showButtonLabel }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { author, createdAt, id, text } = postData;

  return (
    <Box direction="row" onClick={event => event.stopPropagation()}>
      <Modal
        handleClose={() => setModalOpen(false)}
        isOpen={modalOpen}
        title="Create a New Reply"
        width="large"
      >
        <Box margin={{ vertical: "small" }}>
          <Box direction="row">
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
            <Box>
              <Text as="p">
                <Text weight="bold">{author.fullName}</Text>{" "}
                <Text>
                  <Link to={`/profile/${author.username}`}>
                    <Anchor color="dark-4" as="span">
                      @{author.username}
                    </Anchor>
                  </Link>
                </Text>
              </Text>
              <Text as="p" margin={{ top: "small" }}>
                {text}
              </Text>
              <Text
                as="p"
                color="dark-3"
                size="small"
                margin={{ top: "small" }}
              >
                {displayRelativeDateOrTime(createdAt)}
              </Text>
            </Box>
          </Box>
          <Text as="p" margin={{ top: "medium" }}>
            <Text color="dark-3">Replying to </Text>
            <Link to={`/profile/${author.username}`}>
              <Anchor as="span">@{author.username}</Anchor>
            </Link>
            :
          </Text>
        </Box>
        <CreateContentForm parentPostId={id} />
      </Modal>
      <Button
        a11yTitle="Reply"
        icon={
          <ChatOption
            color={showButtonLabel ? "white" : "brand"}
            size={iconSize}
          />
        }
        label={showButtonLabel && "Reply"}
        onClick={() => setModalOpen(!modalOpen)}
        primary={showButtonLabel}
      />
    </Box>
  );
};

NewReplyModal.defaultProps = {
  iconSize: "small",
  showButtonLabel: true
};

export default NewReplyModal;

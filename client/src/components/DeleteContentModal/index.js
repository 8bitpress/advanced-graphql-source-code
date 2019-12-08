import { Button, Box, Text } from "grommet";
import { Trash } from "grommet-icons";
import { useMutation } from "@apollo/client";
import { withRouter } from "react-router-dom";
import React, { useState } from "react";

import { DELETE_POST, DELETE_REPLY } from "../../graphql/mutations";
import { useAuth } from "../../context/AuthContext";
import Modal from "../Modal";

const DeleteContentModal = ({
  history,
  iconSize,
  id,
  isReply,
  parentPostId
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    viewerQuery: {
      data: { viewer }
    }
  } = useAuth();
  const [deletePost, { loading }] = useMutation(DELETE_POST, {
    onCompleted: () => {
      history.push(`/home`);
    }
  });
  const [deleteReply] = useMutation(DELETE_REPLY, {
    onCompleted: () => {
      history.push(`/home`);
    }
  });

  return (
    <Box direction="row" onClick={event => event.stopPropagation()}>
      <Modal
        handleClose={() => setModalOpen(false)}
        isOpen={modalOpen}
        title="Please Confirm"
        width="medium"
      >
        <Text as="p">
          {`Are you sure you want to permanently delete this ${
            isReply ? "reply" : "post"
          }?`}
        </Text>
        <Box direction="row" justify="end">
          <Button
            color="status-critical"
            label="Delete"
            onClick={async () => {
              if (isReply) {
                await deleteReply({ variables: { where: { id } } });
              } else {
                await deletePost({
                  variables: { where: { id } }
                });
              }
            }}
            primary
          />
        </Box>
      </Modal>
      <Button
        a11yTitle="Delete"
        icon={<Trash color="status-critical" size={iconSize} />}
        onClick={() => setModalOpen(!modalOpen)}
      />
    </Box>
  );
};

DeleteContentModal.defaultProps = {
  iconSize: "small",
  isReply: false,
  parentPostId: null
};

export default withRouter(DeleteContentModal);

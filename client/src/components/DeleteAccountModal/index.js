import { Box, Button, Text } from "grommet";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";

import { DELETE_ACCOUNT } from "../../graphql/mutations";
import { useAuth } from "../../context/AuthContext";
import Modal from "../Modal";

const DeleteAccountModal = ({ accountId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { logout } = useAuth();
  const [deleteAccount, { loading }] = useMutation(DELETE_ACCOUNT, {
    onCompleted: logout
  });

  return (
    <Box direction="row">
      <Modal
        handleClose={() => setModalOpen(false)}
        isOpen={modalOpen}
        title="Please Confirm"
        width="medium"
      >
        <Text as="p">
          Are you sure you want to permanently delete your account and all of
          its content?
        </Text>
        <Text as="p">This action cannot be reversed.</Text>
        <Box direction="row" justify="end">
          <Button
            color="status-critical"
            disabled={loading}
            label="Confirm Account Deletion"
            onClick={() => {
              deleteAccount({
                variables: { where: { id: accountId } }
              });
            }}
            primary
          />
        </Box>
      </Modal>
      <Button
        color="status-critical"
        label="Delete Account"
        onClick={() => {
          setModalOpen(true);
        }}
      />
    </Box>
  );
};

export default DeleteAccountModal;

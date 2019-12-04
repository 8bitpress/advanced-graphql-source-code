import { Redirect } from "react-router-dom";
import { Text } from "grommet";
import React, { useRef, useState } from "react";

import { useAuth } from "../../../context/AuthContext";
import CreateProfileForm from "../../../components/CreateProfileForm";
import Modal from "../../../components/Modal";

const Profile = ({ history }) => {
  const [modalOpen, setModalOpen] = useState(true);
  const {
    viewerQuery: {
      data: {
        viewer: { id, profile }
      }
    },
    updateViewer
  } = useAuth();
  const profileRef = useRef(profile);

  if (!profileRef.current && profile) {
    return <Redirect to={"/profile"} />;
  }

  return (
    <Modal
      handleClose={
        profile &&
        (() => {
          setModalOpen(false);
          history.push("/profile");
        })
      }
      isOpen={modalOpen}
      title={profile ? "Edit Profile" : "Create Profile"}
      width="600px"
    >
      <Text as="p">
        {profile
          ? "Update your user information below:"
          : "Please create your user profile before proceeding:"}
      </Text>{" "}
      {profile ? null : (
        <CreateProfileForm accountId={id} updateViewer={updateViewer} />
      )}
    </Modal>
  );
};

export default Profile;

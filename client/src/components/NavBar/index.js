import { Anchor, Box, Button, Heading, Menu } from "grommet";
import { Menu as MenuIcon } from "grommet-icons";
import { useHistory, useLocation } from "react-router-dom";
import React, { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import CreateContentForm from "../CreateContentForm";
import Modal from "../Modal";

const NavBar = () => {
  const history = useHistory();
  const location = useLocation();
  const { logout, viewerQuery } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header>
      <Box
        align="center"
        border={{
          color: "light-4",
          size: "xsmall",
          style: "solid",
          side: "bottom"
        }}
        direction="row"
        justify="between"
        pad="small"
      >
        <Heading color="brand" level="1" size="32px">
          <Anchor href="/" label="devchirps" primary />
        </Heading>
        {location.pathname !== "/" && (
          <Box align="center" direction="row">
            <Modal
              handleClose={() => setModalOpen(false)}
              isOpen={modalOpen}
              title="Create a New Post"
              width="large"
            >
              <CreateContentForm />
            </Modal>
            <Box>
              <Button
                label="New Post"
                margin={{ right: "xsmall" }}
                onClick={() => setModalOpen(!modalOpen)}
              />
            </Box>
            <Menu
              a11yTitle="User Menu"
              dropAlign={{ right: "right", top: "top" }}
              icon={<MenuIcon color="brand" size="20px" />}
              items={[
                {
                  label: "My Profile",
                  onClick: () =>
                    history.push(
                      `/profile/${viewerQuery.data.viewer.profile.username}`
                    )
                },
                {
                  label: "Account Settings",
                  onClick: () => history.push("/settings/account")
                },
                { label: "Logout", onClick: logout }
              ]}
              justifyContent="end"
            />
          </Box>
        )}
      </Box>
    </header>
  );
};

export default NavBar;

import { Anchor, Box, Heading, Menu } from "grommet";
import { Menu as MenuIcon } from "grommet-icons";
import { withRouter } from "react-router-dom";
import React from "react";

import { useAuth } from "../../context/AuthContext";

const NavBar = ({ history, location }) => {
  const { logout, viewerQuery } = useAuth();

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
              { label: "Logout", onClick: logout }
            ]}
            justifyContent="end"
          />
        )}
      </Box>
    </header>
  );
};

export default withRouter(NavBar);

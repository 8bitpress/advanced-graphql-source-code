import { Box } from "grommet";
import { ChatOption } from "grommet-icons";
import { Redirect } from "react-router-dom";
import React from "react";

import { useAuth } from "../../context/AuthContext";
import AccentButton from "../../components/AccentButton";
import Loader from "../../components/Loader";
import MainLayout from "../../layouts/MainLayout";

const Index = () => {
  const { checkingSession, isAuthenticated, login, viewerQuery } = useAuth();
  let viewer;

  if (viewerQuery && viewerQuery.data) {
    viewer = viewerQuery.data.viewer;
  }

  if (checkingSession) {
    return <Loader centered />;
  } else if (isAuthenticated && viewer) {
    return <Redirect to="/home" />;
  }

  return (
    <MainLayout centered>
      <Box align="center" margin={{ top: "small" }} width="100%">
        <ChatOption color="brand" size="300px" />
        <div>
          <AccentButton
            label="Login / Sign-up"
            margin={{ top: "medium" }}
            onClick={login}
          />
        </div>
      </Box>
    </MainLayout>
  );
};

export default Index;

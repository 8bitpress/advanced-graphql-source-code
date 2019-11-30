import { Box } from "grommet";
import { ChatOption } from "grommet-icons";
import React from "react";

import { useAuth } from "../../context/AuthContext";
import AccentButton from "../../components/AccentButton";
import MainLayout from "../../layouts/MainLayout";

const Index = () => {
  const value = useAuth();

  return (
    <MainLayout centered>
      <Box align="center" margin={{ top: "small" }} width="100%">
        <ChatOption color="brand" size="300px" />
        <div>
          <AccentButton
            label="Login / Sign-up"
            margin={{ top: "medium" }}
            onClick={value.login}
          />
        </div>
      </Box>
    </MainLayout>
  );
};

export default Index;

import { Box } from "grommet";
import { ChatOption } from "grommet-icons";
import React from "react";

import AccentButton from "../../components/AccentButton";
import MainLayout from "../../layouts/MainLayout";

const Index = () => {
  return (
    <MainLayout centered>
      <Box align="center" margin={{ top: "small" }} width="100%">
        <ChatOption color="brand" size="300px" />
        <div>
          <AccentButton
            label="Login / Sign-up"
            margin={{ top: "medium" }}
            onClick={() => console.log("Clicked!")}
          />
        </div>
      </Box>
    </MainLayout>
  );
};

export default Index;

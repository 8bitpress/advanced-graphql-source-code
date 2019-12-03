import { Text } from "grommet";
import React from "react";

const CharacterCountLabel = ({ currentChars, label, max }) => {
  return (
    <Text color={currentChars > max ? "status-critical" : null}>
      {`${label} (${currentChars}/${max} characters)`}
    </Text>
  );
};

export default CharacterCountLabel;

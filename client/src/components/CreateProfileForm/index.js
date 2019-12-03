import { Box, Button, Form, FormField } from "grommet";
import { withRouter } from "react-router-dom";
import React, { useState } from "react";

import CharacterCountLabel from "../CharacterCountLabel";
import RequiredLabel from "../RequiredLabel";

const CreateProfileForm = ({ accountId, history, updateViewer }) => {
  const [descCharCount, setDescCharCount] = useState(0);

  return (
    <Form
      messages={{ required: "Required" }}
      onSubmit={event => {
        console.log("Submitted:", event.value);
      }}
    >
      <FormField
        htmlForm="username"
        id="username"
        label={<RequiredLabel>Username</RequiredLabel>}
        name="username"
        placeholder="Pick a unique username"
        required
        validate={fieldData => {
          if (!/^[A-Za-z\d_]*$/.test(fieldData)) {
            return "Alphanumeric characters only (use underscores for whitespace)";
          }
        }}
      />
      <FormField
        htmlFor="fullName"
        id="fullName"
        label="Full Name"
        name="fullName"
        placeholder="Add your full name"
      />
      <FormField
        htmlFor="description"
        id="description"
        label={
          <CharacterCountLabel
            currentChars={descCharCount}
            label="Description"
            max={256}
          />
        }
        name="description"
        onInput={event => setDescCharCount(event.target.value.length)}
        placeholder="Write short bio or description about yourself"
        validate={fieldData => {
          if (fieldData && fieldData.length > 256) {
            return "256 maximum character count exceeded";
          }
        }}
      />
      <Button label="Create Profile" primary type="submit" />
    </Form>
  );
};

export default withRouter(CreateProfileForm);

import { Box, Button, Form, FormField, Text } from "grommet";
import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { GET_VIEWER } from "../../graphql/queries";
import { UPDATE_PROFILE } from "../../graphql/mutations";
import { updateProfileContentAuthor } from "../../lib/updateQueries";
import CharacterCountLabel from "../CharacterCountLabel";
import Loader from "../Loader";
import RequiredLabel from "../RequiredLabel";

const EditProfileForm = ({ profileData, updateViewer }) => {
  const { description, fullName, username } = profileData;

  const [descCharCount, setDescCharCount] = useState(
    (description && description.length) || 0
  );
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [updateProfile, { error, loading }] = useMutation(UPDATE_PROFILE, {
    update: (cache, { data: { updateProfile } }) => {
      const { viewer } = cache.readQuery({ query: GET_VIEWER });
      const viewerWithProfile = { ...viewer, profile: updateProfile };
      cache.writeQuery({
        query: GET_VIEWER,
        data: { viewer: viewerWithProfile }
      });
      updateProfileContentAuthor(cache, profileData.username, updateProfile);
      updateViewer(viewerWithProfile);
    },
    onCompleted: () => {
      setShowSavedMessage(true);
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSavedMessage(false);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <Form
      errors={{
        username:
          error &&
          error.message.includes("duplicate key") &&
          "Username is already in use"
      }}
      messages={{ required: "Required" }}
      onSubmit={event => {
        updateProfile({
          variables: {
            data: { ...event.value },
            where: { username }
          }
        });
      }}
    >
      <FormField
        htmlFor="username"
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
        value={username || ""}
      />
      <FormField
        htmlFor="fullName"
        id="fullName"
        label="Full Name"
        name="fullName"
        placeholder="Add your full name"
        value={fullName || ""}
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
        value={description || ""}
      />
      <Box align="center" direction="row" justify="end">
        {loading && <Loader size="medium" />}
        {showSavedMessage && <Text as="p">Changes saved!</Text>}
        <Button
          disabled={loading}
          label="Save Profile"
          margin={{ left: "xsmall" }}
          primary
          type="submit"
        />
      </Box>
    </Form>
  );
};

export default EditProfileForm;

import {
  Box,
  Button,
  CheckBox,
  Form,
  FormField,
  Image,
  Text,
  TextInput
} from "grommet";
import { useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";

import { GET_VIEWER } from "../../graphql/queries";
import { UPDATE_PROFILE } from "../../graphql/mutations";
import { updateProfileContentAuthor } from "../../lib/updateQueries";
import CharacterCountLabel from "../CharacterCountLabel";
import Loader from "../Loader";
import RequiredLabel from "../RequiredLabel";

const EditProfileForm = ({ profileData, updateViewer }) => {
  const { avatar, description, fullName, username } = profileData;
  const validFormats = ["image/jpeg", "image/jpg", "image/png"];

  const avatarInput = useRef();
  const [descCharCount, setDescCharCount] = useState(
    (description && description.length) || 0
  );
  const [imageFile, setImageFile] = useState();
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
  const [githubChecked, setGithubChecked] = useState(false);

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
        const {
          files: [file]
        } = avatarInput.current;

        updateProfile({
          variables: {
            data: {
              ...event.value,
              ...(file && { avatar: file }),
              ...(githubChecked && { github: githubChecked })
            },
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
      <FormField
        htmlFor="avatar"
        id="avatar"
        label="Avatar (choose a square image for best results)"
        name="avatar"
        validate={() => {
          const {
            files: [file]
          } = avatarInput.current;

          if (file && !validFormats.includes(file.type)) {
            return "Upload JPG or PNG files only";
          } else if (file && file.size > 2 * 1024 * 1024) {
            return "Maximum file size is 2 MB";
          }
        }}
      >
        <Box
          alignSelf="start"
          height="36px"
          margin={{ left: "small" }}
          overflow="hidden"
          round="full"
          width="36px"
        >
          <Image
            fit="cover"
            src={imageFile || avatar}
            alt={`${fullName} profile image`}
          />
        </Box>
        <TextInput
          accept={validFormats.join(", ")}
          ref={avatarInput}
          onChange={event => {
            setImageFile(
              event.target.files.length
                ? URL.createObjectURL(event.target.files[0])
                : null
            );
          }}
          type="file"
        />
      </FormField>
      <FormField htmlFor="github" id="github" name="github">
        <Box pad={{ bottom: "small", top: "small" }}>
          <CheckBox
            checked={githubChecked}
            label="Fetch updated profile page URL and pinned items from GitHub"
            onChange={event => {
              setGithubChecked(event.target.checked);
            }}
          />
        </Box>
      </FormField>
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

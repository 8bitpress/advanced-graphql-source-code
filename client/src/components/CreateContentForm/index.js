import {
  Box,
  Button,
  Form,
  FormField,
  Image,
  Stack,
  TextArea,
  TextInput
} from "grommet";
import { Close } from "grommet-icons";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import React, { useRef, useState } from "react";

import { CREATE_POST, CREATE_REPLY } from "../../graphql/mutations";

import {
  GET_POST,
  GET_POSTS,
  GET_PROFILE_CONTENT
} from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import CharacterCountLabel from "../CharacterCountLabel";
import Loader from "../Loader";
import RequiredLabel from "../RequiredLabel";

const CreateContentForm = ({ parentPostId }) => {
  const history = useHistory();
  const [contentCharCount, setContentCharCount] = useState(0);
  const value = useAuth();
  const { username } = value.viewerQuery.data.viewer.profile;

  const mediaInput = useRef();
  const [mediaFile, setMediaFile] = useState();
  const validFormats = ["image/gif", "image/jpeg", "image/jpg", "image/png"];

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: ({ createPost: { id } }) => {
      history.push(`/post/${id}`);
    },
    refetchQueries: () => [
      {
        query: GET_POSTS,
        variables: {
          filter: {
            followedBy: username,
            includeBlocked: false
          }
        }
      },
      {
        query: GET_PROFILE_CONTENT,
        variables: { username }
      }
    ]
  });
  const [createReply] = useMutation(CREATE_REPLY, {
    onCompleted: ({ createReply: { id } }) => {
      history.push(`/reply/${id}`);
    },
    refetchQueries: () => [
      { query: GET_POST, variables: { id: parentPostId } },
      {
        query: GET_PROFILE_CONTENT,
        variables: { username }
      }
    ]
  });

  return (
    <Box fill="vertical" overflow="auto">
      <Form
        messages={{ required: "Required" }}
        onSubmit={event => {
          const {
            files: [file]
          } = mediaInput.current;

          if (parentPostId) {
            createReply({
              variables: {
                data: {
                  ...(file && { media: file }),
                  postId: parentPostId,
                  text: event.value.text,
                  username
                }
              }
            }).catch(err => {
              console.log(err)
            });
          } else {
            createPost({
              variables: {
                data: {
                  ...(file && { media: file }),
                  text: event.value.text,
                  username
                }
              }
            }).catch(err => {
              console.log(err)
            });
          }
        }}
      >
        <FormField
          component={TextArea}
          htmlFor="text"
          id="text"
          label={
            <RequiredLabel>
              <CharacterCountLabel
                currentChars={contentCharCount}
                label="Content"
                max={256}
              />
            </RequiredLabel>
          }
          name="text"
          onInput={event => setContentCharCount(event.target.value.length)}
          placeholder={`Write your ${parentPostId ? "reply" : "post"}`}
          required
          validate={fieldData => {
            if (fieldData && fieldData.length > 256) {
              return "256 maximum character count exceeded";
            }
          }}
        />
        <FormField
          htmlFor="media"
          id="media"
          label="Image"
          name="media"
          validate={() => {
            const {
              files: [file]
            } = mediaInput.current;

            if (file && !validFormats.includes(file.type)) {
              return "Upload GIF, JPG or PNG files only";
            } else if (file && file.size > 5 * 1024 * 1024) {
              return "Maximum file size is 5 MB";
            }
          }}
        >
          {mediaFile && (
            <Stack anchor="top-left">
              <Image src={mediaFile} alt="Uploaded content image" />
              <Box
                background="dark-1"
                margin="xsmall"
                overflow="hidden"
                round="full"
              >
                <Button
                  a11yTitle="Remove Image"
                  hoverIndicator
                  icon={<Close size="18px" />}
                  onClick={() => {
                    setMediaFile(null);
                    mediaInput.current.value = "";
                  }}
                />
              </Box>
            </Stack>
          )}
          <TextInput
            accept={validFormats.join(", ")}
            onChange={event => {
              setMediaFile(
                event.target.files.length
                  ? URL.createObjectURL(event.target.files[0])
                  : null
              );
            }}
            ref={mediaInput}
            type="file"
          />
        </FormField>
        <Box align="center" direction="row" justify="end">
          {loading && <Loader size="medium" />}
          <Button
            disabled={loading}
            label="Publish"
            margin={{ bottom: "xsmall", left: "xsmall" }}
            primary
            type="submit"
          />
        </Box>
      </Form>
    </Box>
  );
};

export default CreateContentForm;

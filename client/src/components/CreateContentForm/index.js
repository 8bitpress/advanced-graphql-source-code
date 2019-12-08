import { Box, Button, Form, FormField, TextArea } from "grommet";
import { useMutation } from "@apollo/client";
import { withRouter } from "react-router-dom";
import React, { useState } from "react";

import { CREATE_POST, CREATE_REPLY } from "../../graphql/mutations";
import { useAuth } from "../../context/AuthContext";
import CharacterCountLabel from "../CharacterCountLabel";
import Loader from "../Loader";
import RequiredLabel from "../RequiredLabel";

const CreateContentForm = ({ history, parentPostId }) => {
  const [contentCharCount, setContentCharCount] = useState(0);
  const {
    viewerQuery: {
      data: { viewer }
    }
  } = useAuth();
  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: ({ createPost: { id } }) => {
      history.push(`/post/${id}`);
    }
  });
  const [createReply] = useMutation(CREATE_REPLY, {
    onCompleted: ({ createReply: { id } }) => {
      history.push(`/reply/${id}`);
    }
  });

  return (
    <Form
      messages={{ required: "Required" }}
      onSubmit={event => {
        if (parentPostId) {
          createReply({
            variables: {
              data: {
                postId: parentPostId,
                text: event.value.text,
                username: viewer.profile.username
              }
            }
          });
        } else {
          createPost({
            variables: {
              data: {
                text: event.value.text,
                username: viewer.profile.username
              }
            }
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
      <Box align="center" direction="row" justify="end">
        {loading && <Loader size="medium" />}
        <Button
          disabled={loading}
          label="Publish"
          margin={{ right: "xsmall" }}
          primary
          type="submit"
        />
      </Box>
    </Form>
  );
};

export default withRouter(CreateContentForm);

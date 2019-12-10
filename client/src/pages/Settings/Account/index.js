import { Box, Form, FormField, Heading, Text } from "grommet";
import { useMutation } from "@apollo/client";
import passwordValidator from "password-validator";
import React, { useState } from "react";
import validator from "validator";

import { UPDATE_ACCOUNT } from "../../../graphql/mutations";
import { useAuth } from "../../../context/AuthContext";
import AccentButton from "../../../components/AccentButton";
import Loader from "../../../components/Loader";
import MainLayout from "../../../layouts/MainLayout";
import RequiredLabel from "../../../components/RequiredLabel";

const schema = new passwordValidator();
schema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols(); // prettier-ignore

const Account = () => {
  const {
    logout,
    viewerQuery: {
      data: { viewer }
    }
  } = useAuth();

  const [email, setEmail] = useState(viewer.email);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updateAccountEmail, { loading }] = useMutation(UPDATE_ACCOUNT, {
    onCompleted: logout
  });
  const [updateAccountPassword] = useMutation(UPDATE_ACCOUNT, {
    onCompleted: logout
  });

  return (
    <MainLayout>
      <Box
        border={{
          color: "light-4",
          size: "xsmall",
          style: "solid",
          side: "bottom"
        }}
        pad={{ bottom: "large" }}
        margin={{ bottom: "large", top: "medium" }}
      >
        <Heading
          color="dark-3"
          level={2}
          margin={{ bottom: "large", top: "small" }}
        >
          Account Settings
        </Heading>
        <Heading level={3} margin={{ bottom: "small" }}>
          Change Email
        </Heading>
        <Text as="p" color="dark-2" margin={{ bottom: "medium" }}>
          After updating your email you will be redirected to log in again.
        </Text>
        <Form
          messages={{ required: "Required" }}
          onSubmit={() => {
            updateAccountEmail({
              variables: {
                data: { email },
                where: { id: viewer.id }
              }
            });
          }}
        >
          <FormField
            id="email"
            htmlForm="email"
            label={<RequiredLabel>Email Address</RequiredLabel>}
            name="email"
            onInput={event => setEmail(event.target.value)}
            placeholder="Enter your updated email address"
            required
            validate={fieldData => {
              if (!validator.isEmail(fieldData)) {
                return "Please enter a valid email address";
              }
            }}
            value={email}
          />
          <Box align="center" direction="row" justify="end">
            {loading && <Loader size="medium" />}
            <AccentButton
              disabled={loading || viewer.email === email}
              label="Save"
              margin={{ left: "xsmall" }}
              type="submit"
            />
          </Box>
        </Form>
      </Box>
      <Box>
        <Heading level={3} margin={{ bottom: "medium" }}>
          Change Password
        </Heading>
        <Text as="p" color="dark-2" margin={{ bottom: "medium" }}>
          After updating your password you will be redirected to log in again.
        </Text>
        <Form
          messages={{ required: "Both current and new passwords are required" }}
          onSubmit={() => {
            updateAccountPassword({
              variables: {
                data: { password, newPassword },
                where: { id: viewer.id }
              }
            });
          }}
        >
          <FormField
            htmlForm="password"
            id="password"
            label={<RequiredLabel>Current Password</RequiredLabel>}
            name="password"
            onInput={event => setPassword(event.target.value)}
            placeholder="Confirm your current password"
            required
            type="password"
            value={password}
          />
          <FormField
            htmlForm="newPassword"
            id="newPassword"
            label={<RequiredLabel>New Password</RequiredLabel>}
            name="newPassword"
            onInput={event => setNewPassword(event.target.value)}
            placeholder="Enter your new password"
            required
            type="password"
            validate={fieldData => {
              if (!schema.validate(fieldData)) {
                return "Passwords must be least 8 characters with lowercase and uppercase letters, digits, and special characters.";
              }
            }}
            value={newPassword}
          />
          <Box align="center" direction="row" justify="end">
            {loading && <Loader size="medium" />}
            <AccentButton
              disabled={loading || !password || !newPassword}
              label="Save"
              margin={{ left: "xsmall" }}
              type="submit"
            />
          </Box>
        </Form>
      </Box>
    </MainLayout>
  );
};

export default Account;

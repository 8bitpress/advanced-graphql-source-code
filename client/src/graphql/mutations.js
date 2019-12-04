import { gql } from "@apollo/client";

export const CREATE_PROFILE = gql`
  mutation CREATE_PROFILE($data: CreateProfileInput!) {
    createProfile(data: $data) {
      id
      avatar
      description
      fullName
      username
    }
  }
`;

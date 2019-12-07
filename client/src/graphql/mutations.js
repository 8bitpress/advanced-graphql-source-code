import { gql } from "@apollo/client";

import { basicProfile } from "./fragments";

export const CREATE_POST = gql`
  mutation CREATE_POST($data: CreatePostInput!) {
    createPost(data: $data) {
      id
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation CREATE_PROFILE($data: CreateProfileInput!) {
    createProfile(data: $data) {
      ...basicProfile
    }
  }
  ${basicProfile}
`;

export const CREATE_REPLY = gql`
  mutation CREATE_REPLY($data: CreateReplyInput!) {
    createReply(data: $data) {
      id
      post {
        id
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UPDATE_PROFILE(
    $data: UpdateProfileInput!
    $where: ProfileWhereUniqueInput!
  ) {
    updateProfile(data: $data, where: $where) {
      ...basicProfile
    }
  }
  ${basicProfile}
`;

import { gql } from "@apollo/client";

import { basicProfile } from "./fragments";

export const CHANGE_ACCOUNT_BLOCKED_STATUS = gql`
  mutation CHANGE_ACCOUNT_BLOCKED_STATUS($where: AccountWhereUniqueInput!) {
    changeAccountBlockedStatus(where: $where) {
      id
      isBlocked
    }
  }
`;

export const CHANGE_ACCOUNT_MODERATOR_ROLE = gql`
  mutation CHANGE_ACCOUNT_MODERATOR_ROLE($where: AccountWhereUniqueInput!) {
    changeAccountModeratorRole(where: $where) {
      id
      isModerator
    }
  }
`;

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

export const DELETE_ACCOUNT = gql`
  mutation DELETE_ACCOUNT($where: AccountWhereUniqueInput!) {
    deleteAccount(where: $where)
  }
`;

export const DELETE_POST = gql`
  mutation DELETE_POST($where: ContentWhereUniqueInput!) {
    deletePost(where: $where)
  }
`;

export const DELETE_REPLY = gql`
  mutation DELETE_REPLY($where: ContentWhereUniqueInput!) {
    deleteReply(where: $where)
  }
`;

export const FOLLOW_PROFILE = gql`
  mutation FOLLOW_PROFILE(
    $data: FollowingProfileInput!
    $where: ProfileWhereUniqueInput!
  ) {
    followProfile(data: $data, where: $where) {
      id
    }
  }
`;

export const TOGGLE_POST_BLOCK = gql`
  mutation TOGGLE_POST_BLOCK($where: ContentWhereUniqueInput!) {
    togglePostBlock(where: $where) {
      id
      isBlocked
    }
  }
`;

export const TOGGLE_REPLY_BLOCK = gql`
  mutation TOGGLE_REPLY_BLOCK($where: ContentWhereUniqueInput!) {
    toggleReplyBlock(where: $where) {
      id
      isBlocked
    }
  }
`;

export const UNFOLLOW_PROFILE = gql`
  mutation UNFOLLOW_PROFILE(
    $data: FollowingProfileInput!
    $where: ProfileWhereUniqueInput!
  ) {
    unfollowProfile(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UPDATE_ACCOUNT(
    $data: UpdateAccountInput!
    $where: AccountWhereUniqueInput!
  ) {
    updateAccount(data: $data, where: $where) {
      id
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
      githubUrl
      pinnedItems {
        id
        description
        name
        primaryLanguage
        url
      }
    }
  }
  ${basicProfile}
`;

import { gql } from "@apollo/client";

import { basicPost, basicProfile, basicReply } from "./fragments";

export const GET_PROFILE = gql`
  query GET_PROFILE($username: String!) {
    profile(username: $username) {
      ...basicProfile
      account {
        id
        createdAt
        isBlocked
        isModerator
      }
    }
  }
  ${basicProfile}
`;

export const GET_PROFILE_CONTENT = gql`
  query GET_PROFILE_CONTENT($username: String!) {
    profile(username: $username) {
      id
      following(first: 30) {
        edges {
          node {
            ...basicProfile
          }
        }
      }
      posts(first: 30) {
        edges {
          node {
            ...basicPost
          }
        }
      }
      replies(first: 30) {
        edges {
          node {
            ...basicReply
          }
        }
      }
    }
  }
  ${basicProfile}
  ${basicPost}
  ${basicReply}
`;

export const GET_VIEWER = gql`
  query GET_VIEWER {
    viewer {
      id
      createdAt
      email
      isModerator
      profile {
        ...basicProfile
      }
    }
  }
  ${basicProfile}
`;

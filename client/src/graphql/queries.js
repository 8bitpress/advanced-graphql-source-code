import { gql } from "@apollo/client";

import {
  basicPost,
  basicProfile,
  basicReply,
  postsNextPage,
  repliesNextPage,
  profilesNextPage
} from "./fragments";

export const GET_POST = gql`
  query GET_POST($id: ID!, $repliesCursor: String) {
    post(id: $id) {
      ...basicPost
      replies(first: 30, after: $repliesCursor) @connection(key: "replies") {
        edges {
          node {
            ...basicReply
          }
        }
        ...repliesNextPage
      }
    }
  }
  ${basicPost}
  ${basicReply}
  ${repliesNextPage}
`;

export const GET_POSTS = gql`
  query GET_POSTS($cursor: String, $filter: PostWhereInput) {
    posts(first: 30, after: $cursor, filter: $filter) {
      edges {
        node {
          ...basicPost
        }
      }
      ...postsNextPage
    }
  }
  ${basicPost}
  ${postsNextPage}
`;

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
  query GET_PROFILE_CONTENT(
    $followingCursor: String
    $postsCursor: String
    $repliesCursor: String
    $username: String!
  ) {
    profile(username: $username) {
      id
      following(first: 30, after: $followingCursor)
        @connection(key: "following") {
        edges {
          node {
            ...basicProfile
          }
        }
        ...profilesNextPage
      }
      posts(first: 30, after: $postsCursor) @connection(key: "posts") {
        edges {
          node {
            ...basicPost
          }
        }
        ...postsNextPage
      }
      replies(first: 30, after: $repliesCursor) @connection(key: "replies") {
        edges {
          node {
            ...basicReply
          }
        }
        ...repliesNextPage
      }
    }
  }
  ${basicProfile}
  ${basicPost}
  ${basicReply}
  ${postsNextPage}
  ${profilesNextPage}
  ${repliesNextPage}
`;

export const GET_REPLY = gql`
  query GET_REPLY($id: ID!) {
    reply(id: $id) {
      ...basicReply
      post {
        ...basicPost
      }
    }
  }
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

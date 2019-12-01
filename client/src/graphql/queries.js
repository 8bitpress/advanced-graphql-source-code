import { gql } from "@apollo/client";

export const GET_VIEWER = gql`
  query GET_VIEWER {
    viewer {
      id
      createdAt
      email
      isModerator
      profile {
        id
        avatar
        description
        fullName
        username
      }
    }
  }
`;

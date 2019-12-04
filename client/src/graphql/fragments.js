import { gql } from "@apollo/client";

export const basicProfile = gql`
  fragment basicProfile on Profile {
    id
    avatar
    description
    fullName
    username
  }
`;

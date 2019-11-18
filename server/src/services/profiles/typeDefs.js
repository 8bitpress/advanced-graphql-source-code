import { gql } from "apollo-server";

const typeDefs = gql`
  # INPUTS

  """
  Provides data to create a new user profile.
  """
  input CreateProfileInput {
    "The new user's the unique Auth0 ID."
    accountId: ID!
    "A short bio or description about the user (max. 256 characters)."
    description: String
    "The new user's full name."
    fullName: String
    "The new user's username (must be unique)."
    username: String!
  }

  # TYPES

  extend type Account @key(fields: "id") {
    id: ID! @external
    "Metadata about the user that owns the account."
    profile: Profile
  }

  """
  A profile contains metadata about a specific user.
  """
  type Profile @key(fields: "id") {
    "The unique MongoDB document ID of the user's profile."
    id: ID!
    "The Auth0 account tied to this profile."
    account: Account!
    "The URL of the user's avatar."
    avatar: String
    "A short bio or description about the user (max. 256 characters)."
    description: String
    "Other users that the user follows."
    following: [Profile]
    "The full name of the user."
    fullName: String
    "The unique username of the user."
    username: String!
    "Whether the currently logged in user follows this profile."
    viewerIsFollowing: Boolean
  }

  # QUERIES & MUTATIONS

  extend type Query {
    "Retrieves a single profile by username."
    profile(username: String!): Profile!

    "Retrieves a list of profiles."
    profiles: [Profile]
  }

  extend type Mutation {
    "Creates a new profile tied to an Auth0 account."
    createProfile(data: CreateProfileInput!): Profile!
  }
`;

export default typeDefs;

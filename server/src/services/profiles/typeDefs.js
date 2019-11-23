import { gql } from "apollo-server";

const typeDefs = gql`
  # ENUMS

  """
  Sorting options for profile connections.
  """
  enum ProfileOrderByInput {
    "Order profiles ascending by username."
    username_ASC
    "Order profiles descending by username."
    username_DESC
  }

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

  """
  Provides the unique MongoDB document ID of an existing profile.
  """
  input FollowingProfileInput {
    "The unique profile ID of the user to be followed or unfollowed."
    followingProfileId: ID!
  }

  """
  Provides a search string to query users by usernames or full names.
  """
  input ProfileSearchInput {
    "The text string to search for in usernames or full names."
    text: String!
  }

  """
  Provides the unique username of an existing profile.
  """
  input ProfileWhereUniqueInput {
    "The unique username of the user."
    username: String!
  }

  """
  Provides data to update an existing profile.
  """
  input UpdateProfileInput {
    "The updated user description."
    description: String
    "The update full name of the user."
    fullName: String
    "The updated unique username of the user."
    username: String
  }

  # TYPES

  extend type Account @key(fields: "id") {
    id: ID! @external
    "Metadata about the user that owns the account."
    profile: Profile
  }

  """
  Information about pagination in a connection.
  """
  type PageInfo {
    "The cursor to continue from when paginating forward."
    endCursor: String
    "Whether there are more items when paginating forward."
    hasNextPage: Boolean!
    "Whether there are more items when paginating backward."
    hasPreviousPage: Boolean!
    "The cursor to continue from them paginating backward."
    startCursor: String
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
    following(
      first: Int
      after: String
      last: Int
      before: String
      orderBy: ProfileOrderByInput
    ): ProfileConnection
    "The full name of the user."
    fullName: String
    "The unique username of the user."
    username: String!
    "Whether the currently logged in user follows this profile."
    viewerIsFollowing: Boolean
  }

  """
  A list of profile edges with pagination information.
  """
  type ProfileConnection {
    "A list of profile edges."
    edges: [ProfileEdge]
    "Information to assist with pagination."
    pageInfo: PageInfo!
  }

  """
  A single profile node with its cursor.
  """
  type ProfileEdge {
    "A cursor for use in pagination."
    cursor: ID!
    "A profile at the end of an edge."
    node: Profile!
  }

  # QUERIES & MUTATIONS

  extend type Query {
    "Retrieves a single profile by username."
    profile(username: String!): Profile!

    "Retrieves a list of profiles."
    profiles(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: ProfileOrderByInput
    ): ProfileConnection

    "Performs a search of user profiles. Results are avaiable in descending order by relevance only."
    searchProfiles(
      after: String
      first: Int
      query: ProfileSearchInput!
    ): ProfileConnection
  }

  extend type Mutation {
    "Creates a new profile tied to an Auth0 account."
    createProfile(data: CreateProfileInput!): Profile!

    "Deletes a user profile."
    deleteProfile(where: ProfileWhereUniqueInput!): ID!

    "Allows one user to follow another."
    followProfile(
      data: FollowingProfileInput!
      where: ProfileWhereUniqueInput!
    ): Profile!

    "Allows one user to unfollow another."
    unfollowProfile(
      data: FollowingProfileInput!
      where: ProfileWhereUniqueInput!
    ): Profile!

    "Updates a user's profile details."
    updateProfile(
      data: UpdateProfileInput!
      where: ProfileWhereUniqueInput!
    ): Profile!
  }
`;

export default typeDefs;

import { gql } from "apollo-server";

const typeDefs = gql`
  # SCALARS

  """
  An ISO-8601-encoded UTC date string.
  """
  scalar DateTime

  # ENUMS

  """
  Sorting options for post connections.
  """
  enum PostOrderByInput {
    "Order posts ascending by creation time."
    createdAt_ASC
    "Order posts descending by creation time."
    createdAt_DESC
  }

  # INPUTS

  """
  Provides the unique ID of an existing piece of content.
  """
  input ContentWhereUniqueInput {
    "The unique MongoDB document ID associated with the content."
    id: ID!
  }

  """
  Provides data to create a post.
  """
  input CreatePostInput {
    "The unique username of the user who authored the post."
    username: String!
    "The body content of the post (max. 256 characters)."
    text: String!
  }

  """
  Provides a filter on which posts may be queried.
  """
  input PostWhereInput {
    "The unique username of the user viewing posts by users they follow (including their own)."
    followedBy: String
    "Whether to include posts that have been blocked by a moderator (default is true)."
    includeBlocked: Boolean
  }

  # TYPES

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
  A post contains content authored by a user.
  """
  type Post {
    "The unique MongoDB document ID of the post."
    id: ID!
    "The profile of the user who authored the post."
    author: Profile!
    "The body content of the post (max. 256 characters)."
    text: String!
    "The date and time the post was created."
    createdAt: DateTime!
    "Whether the post is blocked."
    isBlocked: Boolean
    "The URL of a media file associated with the content."
    media: String
  }

  """
  A list of post edges with pagination information.
  """
  type PostConnection {
    "A list of post edges."
    edges: [PostEdge]
    "Information to assist with pagination."
    pageInfo: PageInfo!
  }

  """
  A single post node with its cursor.
  """
  type PostEdge {
    "A cursor for use in pagination."
    cursor: ID!
    "A post at the end of an edge."
    node: Post!
  }

  extend type Profile @key(fields: "id") {
    id: ID! @external
    "A list of posts written by the user."
    posts(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: PostOrderByInput
    ): PostConnection
  }

  extend type Query {
    "Retrieves a single post by MongoDB document ID."
    post(id: ID!): Post!

    "Retrieves a list of posts."
    posts(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: PostOrderByInput
      filter: PostWhereInput
    ): PostConnection
  }

  extend type Mutation {
    "Creates a new post."
    createPost(data: CreatePostInput!): Post!

    "Deletes a post."
    deletePost(where: ContentWhereUniqueInput!): ID! # NEW!
  }
`;

export default typeDefs;

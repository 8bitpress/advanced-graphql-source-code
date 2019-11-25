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

  """
  Sorting options for reply connections.
  """
  enum ReplyOrderByInput {
    "Order replies ascending by creation time."
    createdAt_ASC
    "Order replies descending by creation time."
    createdAt_DESC
  }

  # INTERFACES

  """
  Specifies common fields for posts and replies.
  """
  interface Content {
    "The unique MongoDB document ID of the content."
    id: ID!
    "The profile of the user who authored the content."
    author: Profile!
    "The date and time the content was created."
    createdAt: DateTime!
    "Whether the content is blocked."
    isBlocked: Boolean
    "The URL of a media file associated with the content."
    media: String
    "The body content (max. 256 characters)."
    text: String!
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

  """
  Provides a filter on which replies may be queried.
  """
  input ReplyWhereInput {
    "The unique username of the user who sent the replies."
    from: String
    "The unique username of the user who received the replies."
    to: String
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
  type Post implements Content {
    "The unique MongoDB document ID of the post."
    id: ID!
    "The profile of the user who authored the post."
    author: Profile!
    "The date and time the post was created."
    createdAt: DateTime!
    "Whether the post is blocked."
    isBlocked: Boolean
    "The URL of a media file associated with the content."
    media: String
    "Replies to this post."
    replies(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: ReplyOrderByInput
    ): ReplyConnection
    "The body content of the post (max. 256 characters)."
    text: String!
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
    "A list of replies written by the user."
    replies(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: ReplyOrderByInput
    ): ReplyConnection
  }

  """
  A reply contains content that is a response to another post.
  """
  type Reply implements Content {
    "The unique MongoDB document ID of the reply."
    id: ID!
    "The profile of the user who authored the reply."
    author: Profile!
    "The date and time the reply was created."
    createdAt: DateTime!
    "Whether the reply is blocked."
    isBlocked: Boolean
    "The URL of a media file associated with the content."
    media: String
    "The parent post of the reply."
    post: Post
    "The author of the parent post of the reply."
    postAuthor: Profile
    "The body content of the reply (max. 256 characters)."
    text: String!
  }

  """
  A list of reply edges with pagination information.
  """
  type ReplyConnection {
    "A list of reply edges."
    edges: [ReplyEdge]
    "Information to assist with pagination."
    pageInfo: PageInfo!
  }

  """
  A single reply node with its cursor.
  """
  type ReplyEdge {
    "A cursor for use in pagination."
    cursor: ID!
    "A reply at the end of an edge."
    node: Reply!
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

    "Retrieves a single reply by MongoDB document ID."
    reply(id: ID!): Reply!

    "Retrieves a list of replies."
    replies(
      after: String
      before: String
      first: Int
      last: Int
      orderBy: ReplyOrderByInput
      filter: ReplyWhereInput!
    ): ReplyConnection
  }

  extend type Mutation {
    "Creates a new post."
    createPost(data: CreatePostInput!): Post!

    "Deletes a post."
    deletePost(where: ContentWhereUniqueInput!): ID! # NEW!
  }
`;

export default typeDefs;

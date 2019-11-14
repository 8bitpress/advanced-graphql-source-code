import { gql } from "apollo-server";

const typeDefs = gql`
  type Account @key(fields: "id") {
    id: ID!
    createdAt: String!
    email: String!
    isModerator: Boolean
  }

  input AccountWhereUniqueInput {
    id: ID!
  }

  input CreateAccountInput {
    email: String!
    password: String!
  }

  input UpdateAccountInput {
    email: String
    newPassword: String
    password: String
  }

  extend type Query {
    account(id: ID!): Account!
    accounts: [Account]
    viewer: Account
  }

  extend type Mutation {
    createAccount(data: CreateAccountInput!): Account!
    deleteAccount(where: AccountWhereUniqueInput!): Boolean!
    updateAccount(
      data: UpdateAccountInput!
      where: AccountWhereUniqueInput!
    ): Account!
  }
`;

export default typeDefs;

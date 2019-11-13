import { gql } from "apollo-server";

const typeDefs = gql`
  type Account @key(fields: "id") {
    id: ID!
    createdAt: String!
    email: String!
  }

  extend type Query {
    account(id: ID!): Account!
    accounts: [Account]
    viewer: Account
  }
`;

export default typeDefs;

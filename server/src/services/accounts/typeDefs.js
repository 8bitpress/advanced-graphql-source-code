import { gql } from "apollo-server";

const typeDefs = gql`
  extend type Query {
    hello: String
  }
`;

export default typeDefs;

import { ApolloServer, gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello() {
      return "world";
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

export default server;

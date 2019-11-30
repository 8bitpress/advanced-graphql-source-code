import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  credentials:
    process.env.NODE_ENV === "production" ? "same-origin" : "include",
  link: new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT
  })
});

export default client;

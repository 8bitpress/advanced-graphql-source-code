import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    credentials:
      process.env.NODE_ENV === "production" ? "same-origin" : "include",
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
  })
});

export default client;

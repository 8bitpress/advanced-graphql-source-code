import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import typePolicies from "./typePolicies";

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies
  }),
  link: new HttpLink({
    credentials:
      process.env.NODE_ENV === "production" ? "same-origin" : "include",
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
  })
});

export default client;

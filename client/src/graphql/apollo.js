import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

import typePolicies from "./typePolicies";

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies
  }),
  link: createUploadLink({
    credentials:
      process.env.NODE_ENV === "production" ? "same-origin" : "include",
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
  })
});

export default client;

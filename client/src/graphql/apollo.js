import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache
} from "@apollo/client";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "apollo-link-error";
import { setContext } from "@apollo/link-context";
import React from "react";

import { useAuth } from "../context/AuthContext";
import typePolicies from "./typePolicies";

const cache = new InMemoryCache({ typePolicies });

const createApolloClient = getToken => {
  const uploadLink = createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
  });
  const authLink = setContext(async (request, { headers }) => {
    const accessToken = await getToken();
    return {
      headers: { ...headers, Authorization: `Bearer ${accessToken}` }
    };
  });
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ extensions: { serviceName }, message, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Service: ${serviceName}, Path: ${path[0]}`
        )
      );
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });
  const persistedQueryLink = createPersistedQueryLink();

  return new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, persistedQueryLink, authLink, uploadLink])
  });
};

const ApolloProviderWithAuth = ({ children }) => {
  const { getToken } = useAuth();
  const client = createApolloClient(getToken);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export { createApolloClient };
export default ApolloProviderWithAuth;

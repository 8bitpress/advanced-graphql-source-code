import { ApolloServer } from "apollo-server-express";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { RedisCache } from "apollo-server-cache-redis";
import depthLimit from "graphql-depth-limit";
import waitOn from "wait-on";

import { readNestedFileStreams } from "../lib/handleUploads";
import accountsTypeDefs from "../services/accounts/typeDefs";
import profilesTypeDefs from "../services/profiles/typeDefs";
import contentTypeDefs from "../services/content/typeDefs";

export default async function() {
  const serviceDefinitions = [
    {
      name: "accounts",
      url: process.env.ACCOUNTS_SERVICE_URL,
      typeDefs: accountsTypeDefs
    },
    {
      name: "profiles",
      url: process.env.PROFILES_SERVICE_URL,
      typeDefs: profilesTypeDefs
    },
    {
      name: "content",
      url: process.env.CONTENT_SERVICE_URL,
      typeDefs: contentTypeDefs
    }
  ];

  const options = {
    resources: [
      `tcp:${process.env.ACCOUNTS_SERVICE_PORT}`,
      `tcp:${process.env.PROFILES_SERVICE_PORT}`,
      `tcp:${process.env.CONTENT_SERVICE_PORT}`
    ]
  };

  await waitOn(options).catch(error => {
    console.log("Error waiting for service ports:", error);
  });

  const gateway = new ApolloGateway({
    serviceList: serviceDefinitions,
    buildService({ name, url }) {
      return new RemoteGraphQLDataSource({
        url,
        async willSendRequest({ request, context }) {
          await readNestedFileStreams(request.variables);
          request.http.headers.set(
            "user",
            context.user ? JSON.stringify(context.user) : null
          );
        }
      });
    },
    ...(process.env.NODE_ENV === "development" && {
      experimental_updateServiceDefinitions(_config) {
        return { serviceDefinitions, isNewSchema: true };
      }
    })
  });

  return new ApolloServer({
    gateway,
    subscriptions: false,
    context: ({ req }) => {
      const user = req.user || null;
      return { user };
    },
    persistedQueries: {
      cache: new RedisCache({
        host: process.env.REDIS_HOST_ADDRESS,
        post: process.env.REDIS_PORT,
        ttl: 600
      })
    },
    validationRules: [depthLimit(10)]
  });
}

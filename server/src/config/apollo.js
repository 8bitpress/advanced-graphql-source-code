import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { ApolloServer } from "apollo-server-express";
import { RedisCache } from "apollo-server-cache-redis";
import depthLimit from "graphql-depth-limit";
import waitOn from "wait-on";

import { readNestedFileStreams } from "../lib/handleUploads";

export default async function() {
  const options = {
    resources: [
      `tcp:${process.env.ACCOUNTS_SERVICE_PORT}`,
      `tcp:${process.env.PROFILES_SERVICE_PORT}`,
      `tcp:${process.env.CONTENT_SERVICE_PORT}`
    ]
  };

  await waitOn(options).catch(error => {
    console.log("Error waiting for services:", error);
  });

  const gateway = new ApolloGateway({
    serviceList: [
      { name: "accounts", url: process.env.ACCOUNTS_SERVICE_URL },
      { name: "profiles", url: process.env.PROFILES_SERVICE_URL },
      { name: "content", url: process.env.CONTENT_SERVICE_URL }
    ],
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
    }
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
        ...(process.env.NODE_ENV === "production" && {
          password: process.env.REDIS_PASSWORD
        }),
        host: process.env.REDIS_HOST_ADDRESS,
        post: process.env.REDIS_PORT,
        ttl: 600
      })
    },
    validationRules: [depthLimit(10)]
  });
}

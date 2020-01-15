import { ApolloServer } from "apollo-server-express";
import { ApolloGateway, RemoteGraphQLDataSource } from "@apollo/gateway";
import { RedisCache } from "apollo-server-cache-redis";

import { readNestedFileStreams } from "../lib/handleUploads";

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

const server = new ApolloServer({
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
  }
});

export default server;

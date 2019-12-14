import { ApolloServer } from "apollo-server";
import { applyMiddleware } from "graphql-middleware";
import { buildFederatedSchema } from "@apollo/federation";

import {
  initDeleteAccountQueue,
  initDeleteProfileQueue,
  onDeleteAccount
} from "./queues";
import auth0 from "../../config/auth0";
import GitHubDataSource from "./datasources/GitHubDataSource";
import initMongoose from "../../config/mongoose";
import permissions from "./permissions";
import Profile from "../../models/Profile";
import ProfilesDataSource from "./datasources/ProfilesDataSource";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

(async () => {
  const port = process.env.PROFILES_SERVICE_PORT;
  const deleteAccountQueue = await initDeleteAccountQueue();
  const deleteProfileQueue = await initDeleteProfileQueue();

  deleteAccountQueue.listen(
    { interval: 5000, maxReceivedCount: 5 },
    payload => {
      onDeleteAccount(payload, deleteProfileQueue);
    }
  );

  const schema = applyMiddleware(
    buildFederatedSchema([{ typeDefs, resolvers }]),
    permissions
  );

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const user = req.headers.user ? JSON.parse(req.headers.user) : null;
      return { user };
    },
    dataSources: () => {
      return {
        githubAPI: new GitHubDataSource({ auth0 }),
        profilesAPI: new ProfilesDataSource({ auth0, Profile })
      };
    }
  });

  initMongoose();

  const { url } = await server.listen({ port });
  console.log(`Profiles service ready at ${url}`);
})();

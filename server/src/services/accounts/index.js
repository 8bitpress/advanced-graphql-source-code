import { ApolloServer } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

(async () => {
  const port = process.env.ACCOUNTS_SERVICE_PORT;

  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    context: ({ req }) => {
      const user = req.headers.user ? JSON.parse(req.headers.user) : null;
      return { user };
    }
  });

  const { url } = await server.listen({ port });
  console.log(`Accounts service ready at ${url}`);
})();

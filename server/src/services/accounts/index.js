import { ApolloServer } from "apollo-server";

import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

(async () => {
  const port = process.env.ACCOUNTS_SERVICE_PORT;

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const { url } = await server.listen({ port });
  console.log(`Accounts service ready at ${url}`);
})();

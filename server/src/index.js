import * as dotenv from "dotenv";
dotenv.config();

import server from "./config/apollo";
import app from "./config/app";

const port = process.env.PORT;

server.applyMiddleware({ app });

app.listen({ port }, () =>
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
);

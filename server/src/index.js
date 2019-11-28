import server from "./config/apollo";
import app from "./config/app";

const port = process.env.PORT;

server.applyMiddleware({ app, cors: false });

app.listen({ port }, () =>
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
);

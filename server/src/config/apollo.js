import { ApolloServer } from "apollo-server-express";
import { ApolloGateway } from "@apollo/gateway";

const gateway = new ApolloGateway({
  serviceList: [{ name: "accounts", url: process.env.ACCOUNTS_SERVICE_URL }]
});

const server = new ApolloServer({
  gateway,
  subscriptions: false
});

export default server;

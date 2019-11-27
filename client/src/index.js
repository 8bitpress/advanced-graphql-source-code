import { ApolloProvider } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";

import client from "./graphql/apollo";

import "./index.css";

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <p>Hello, world!</p>
    </div>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));

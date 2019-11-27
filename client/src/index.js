import { ApolloProvider } from "@apollo/client";
import { Grommet } from "grommet";
import React from "react";
import ReactDOM from "react-dom";

import client from "./graphql/apollo";
import GlobalStyle from "./styles/global";
import theme from "./styles/theme";

const App = () => (
  <ApolloProvider client={client}>
    <GlobalStyle />
    <Grommet theme={theme}>
      <div>
        <p>Hello, world!</p>
      </div>
    </Grommet>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));

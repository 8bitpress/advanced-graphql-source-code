import { Grommet } from "grommet";
import { Router } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";

import { AuthProvider } from "./context/AuthContext";
import ApolloProviderWithAuth from "./graphql/apollo";
import GlobalStyle from "./styles/global";
import history from "./routes/history";
import Routes from "./routes";
import theme from "./styles/theme";

const App = () => (
  <AuthProvider>
    <ApolloProviderWithAuth>
      <GlobalStyle />
      <Grommet theme={theme}>
        <Router history={history}>
          <Routes />
        </Router>
      </Grommet>
    </ApolloProviderWithAuth>
  </AuthProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));

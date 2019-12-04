import { useApolloClient } from "@apollo/client";
import React, { createContext, useContext, useEffect, useState } from "react";

import { GET_VIEWER } from "../graphql/queries";
import Auth0 from "../lib/Auth0";
import history from "../routes/history";

const auth0 = new Auth0();
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [checkingSession, setCheckingSession] = useState(true);
  const [viewerQuery, setViewerQuery] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    const authenticate = async () => {
      if (history.location.pathname !== "/login") {
        try {
          await auth0.silentAuth();
          const viewer = await client.query({ query: GET_VIEWER });
          setViewerQuery(viewer);
        } catch {
          history.push("/");
        }
      }
      setCheckingSession(false);
    };
    authenticate();
  }, [client]);

  const value = {
    ...auth0,
    checkingSession,
    updateViewer: viewer => {
      setViewerQuery({ ...viewerQuery, data: { viewer } });
    },
    viewerQuery
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };
export default AuthContext;

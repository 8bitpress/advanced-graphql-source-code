import React, { createContext, useContext, useEffect, useState } from "react";

import { GET_VIEWER } from "../graphql/queries";
import Auth0 from "../lib/Auth0";
import client from "../graphql/apollo";
import history from "../routes/history";

const auth0 = new Auth0();
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [checkingSession, setCheckingSession] = useState(true);
  const [viewerQuery, setViewerQuery] = useState(null);

  const updateViewer = async () => {
    const result = await client.query({ query: GET_VIEWER });
    setViewerQuery(result);
  };

  useEffect(() => {
    const authenticate = async () => {
      if (history.location.pathname !== "/login") {
        try {
          await auth0.silentAuth();
          await updateViewer();
        } catch {
          history.push("/");
        }
      }
      setCheckingSession(false);
    };
    authenticate();
  }, []);

  const value = { ...auth0, checkingSession, updateViewer, viewerQuery };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };
export default AuthContext;

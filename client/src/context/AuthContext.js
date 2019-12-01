import React, { createContext, useContext, useEffect, useState } from "react";

import Auth0 from "../lib/Auth0";
import getViewer from "../lib/getViewer";
import history from "../routes/history";

const auth0 = new Auth0();
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [checkingSession, setCheckingSession] = useState(true);
  const [viewerQuery, setViewerQuery] = useState(null);

  const updateViewer = async () => {
    const result = await getViewer();
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

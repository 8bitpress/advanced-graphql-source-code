import React, { createContext, useContext, useEffect, useState } from "react";

import Auth0 from "../lib/Auth0";
import history from "../routes/history";

const auth0 = new Auth0();
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      if (history.location.pathname !== "/login") {
        try {
          await auth0.silentAuth();
        } catch {
          history.push("/");
        }
      }
      setCheckingSession(false);
    };
    authenticate();
  }, []);

  const value = { ...auth0, checkingSession };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, useAuth };
export default AuthContext;

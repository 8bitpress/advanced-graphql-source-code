import React, { useEffect } from "react";

import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

const Login = ({ history }) => {
  const { isAuthenticated, handleAuthentication } = useAuth();

  useEffect(() => {
    const authenticate = async () => {
      if (!isAuthenticated()) {
        try {
          await handleAuthentication();
          window.location.reload(true);
        } catch {
          history.push("/");
        }
      } else {
        history.push("/home");
      }
    };
    authenticate();
  }, [handleAuthentication, history, isAuthenticated]);

  return <Loader centered />;
};

export default Login;

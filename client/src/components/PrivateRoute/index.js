import React from "react";
import { Route, Redirect } from "react-router-dom";

import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { checkingSession, isAuthenticated, viewerQuery } = useAuth();

  const renderRoute = props => {
    let content = null;

    if (checkingSession) {
      content = <Loader centered />;
    } else if (isAuthenticated() && viewerQuery) {
      content = <Component {...props} />;
    } else if (!viewerQuery) {
      content = (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      );
    }

    return content;
  };

  return <Route {...rest} render={renderRoute} />;
};

export default PrivateRoute;

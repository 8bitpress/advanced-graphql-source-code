import { Route, Redirect } from "react-router-dom";
import React from "react";

import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

const PrivateRoute = ({ component: Component, render, ...rest }) => {
  const { checkingSession, isAuthenticated, viewerQuery } = useAuth();

  const renderRoute = props => {
    let content = null;

    if (checkingSession) {
      content = <Loader centered />;
    } else if (
      isAuthenticated() &&
      props.location.pathname !== "/settings/profile" &&
      !viewerQuery.data.viewer.profile
    ) {
      content = <Redirect to="/settings/profile" />;
    } else if (isAuthenticated() && render && viewerQuery) {
      content = render(props);
    } else if (isAuthenticated() && viewerQuery) {
      content = <Component {...props} />;
    } else if (!viewerQuery) {
      content = <Redirect to="/" />;
    }

    return content;
  };

  return <Route {...rest} render={renderRoute} />;
};

export default PrivateRoute;

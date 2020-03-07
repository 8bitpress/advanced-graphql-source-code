import { Route, Redirect } from "react-router-dom";
import React from "react";

import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

const PrivateRoute = ({ component: Component, render, ...rest }) => {
  const { checkingSession, isAuthenticated, viewerQuery } = useAuth();

  const renderRoute = props => {
    let content = null;
    let viewer;

    if (viewerQuery && viewerQuery.data) {
      viewer = viewerQuery.data.viewer;
    }

    if (checkingSession) {
      content = <Loader centered />;
    } else if (
      isAuthenticated &&
      props.location.pathname !== "/settings/profile" &&
      viewer &&
      !viewer.profile
    ) {
      content = <Redirect to="/settings/profile" />;
    } else if (isAuthenticated && render && viewer) {
      content = render(props);
    } else if (isAuthenticated && viewer) {
      content = <Component {...props} />;
    } else if (!viewerQuery || !viewer) {
      content = <Redirect to="/" />;
    }

    return content;
  };

  return <Route {...rest} render={renderRoute} />;
};

export default PrivateRoute;

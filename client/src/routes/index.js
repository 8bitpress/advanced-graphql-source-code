import React from "react";
import { Route, Switch } from "react-router";

import AccountSettings from "../pages/Settings/Account";
import Home from "../pages/Home";
import Index from "../pages/Index";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Post from "../pages/Post";
import PrivateRoute from "../components/PrivateRoute";
import Profile from "../pages/Profile";
import ProfileSettings from "../pages/Settings/Profile";
import Reply from "../pages/Reply";
import Search from "../pages/Search";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <PrivateRoute exact path="/home" component={Home} />
    <Route exact path="/login" component={Login} />
    <PrivateRoute exact path="/profile/:username" component={Profile} />
    <PrivateRoute
      exact
      path="/settings/profile"
      render={props => [
        <Profile key="profile" {...props} />,
        <ProfileSettings key="profile-settings" {...props} />
      ]}
    />
    <PrivateRoute exact path="/post/:id" component={Post} />
    <PrivateRoute exact path="/reply/:id" component={Reply} />
    <PrivateRoute exact path="/search" component={Search} />
    <PrivateRoute exact path="/settings/account" component={AccountSettings} />
    <PrivateRoute component={NotFound} />
  </Switch>
);

export default Routes;

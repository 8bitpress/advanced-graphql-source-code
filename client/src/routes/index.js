import React from "react";
import { Route, Switch } from "react-router";

import Home from "../pages/Home";
import Index from "../pages/Index";
import Login from "../pages/Login";
import PrivateRoute from "../components/PrivateRoute";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <PrivateRoute exact path="/home" component={Home} />
    <Route exact path="/login" component={Login} />
  </Switch>
);
export default Routes;

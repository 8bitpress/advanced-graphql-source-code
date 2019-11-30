import React from "react";
import { Route, Switch } from "react-router";

import Home from "../pages/Home";
import Index from "../pages/Index";
import Login from "../pages/Login";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <Route exact path="/home" component={Home} />
    <Route exact path="/login" component={Login} />
  </Switch>
);
export default Routes;

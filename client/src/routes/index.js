import React from "react";
import { Route, Switch } from "react-router";

import Index from "../pages/Index";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Index} />
  </Switch>
);
export default Routes;

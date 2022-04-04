import React, { Component } from "react";
import { Route, Redirect, Switch, HashRouter } from "react-router-dom";
import AddRolePermissions from "./routes/AddRolePermissions"
import List from "./routes/RolesList";

const Roles = ({ match }) => (
  <div className="">
    <HashRouter>
      <Switch>
        <Route exact path={`${match.url}`} component={List} />
        <Route
          exact
          path={`${match.url}/:role`}
          component={AddRolePermissions}
        />
      </Switch>
    </HashRouter>
  </div>
);

export default Roles;

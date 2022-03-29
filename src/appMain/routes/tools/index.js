import React, { Component } from "react";
import { Route, Redirect, Switch, HashRouter } from "react-router-dom";
import ToolsDetail from "./details/toolsdetail";
import ManageAPIKeys from "../users/routes/ManageAPIKeys";

const Tools = ({ match }) => (
  <div>
    <HashRouter>
      <Switch>
        <Route exact path={`${match.url}`} component={ToolsDetail} />
        <Route
          path={`${match.url}/managekeys/:userId`}
          component={ManageAPIKeys}
        />
        <Route path={`${match.url}/managessokeys/:userId`}>
          <ManageAPIKeys isSSOUser />
        </Route>
      </Switch>
    </HashRouter>
  </div>
);

export default Tools;

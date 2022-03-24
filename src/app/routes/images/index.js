import React, { Component } from "react";
import { Route, Redirect, Switch, HashRouter } from "react-router-dom";
import List from "./routes/List";

const Images = ({ match }) => (
  <div className="app-wrapper">
    <HashRouter>
      <Switch>
        <Route exact path={`${match.url}`} component={List} />
        {/* <Route path={`${match.url}/:userId`} component={UserDetails} /> */}
      </Switch>
    </HashRouter>
  </div>
);

export default Images;

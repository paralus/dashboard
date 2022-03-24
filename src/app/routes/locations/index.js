import React, { Component } from "react";
import { Route, Redirect, Switch, HashRouter } from "react-router-dom";
import LocationList from "./routes/LocationList";

const Locations = ({ match }) => (
  <div className="app-wrapper">
    <HashRouter>
      <Switch>
        <Route exact path={`${match.url}`} component={LocationList} />
      </Switch>
    </HashRouter>
  </div>
);

export default Locations;

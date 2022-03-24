import React, { Component } from "react";
import { Route, Redirect, Switch, HashRouter } from "react-router-dom";
import List from "./routes/List";
import GroupDetail from "./routes/GroupDetail";
import AddUsers from "./routes/AddUsers";
import AssignToProject from "./routes/AssignToProject";
import EditProject from "./routes/EditProject";

const Group = ({ match }) => (
  <div className="">
    <HashRouter>
      <Switch>
        <Route exact path={`${match.url}`} component={List} />
        <Route
          exact
          path={`${match.url}/:groupId/addusers`}
          component={AddUsers}
        />
        <Route
          exact
          path={`${match.url}/:groupId/assigntoproject`}
          component={AssignToProject}
        />
        <Route
          exact
          path={`${match.url}/:groupId/project/:projectId`}
          component={EditProject}
        />
        <Route path={`${match.url}/:groupId`} component={GroupDetail} />
      </Switch>
    </HashRouter>
  </div>
);

export default Group;

import React, { Component } from "react";
import { Route, Redirect, Switch, HashRouter } from "react-router-dom";
import UsersList from "./routes/UsersList";
import UserDetail from "./routes/UserDetail";
import ManageAPIKeys from "./routes/ManageAPIKeys";
import AssignToProject from "./routes/AssignToProject";
import EditProject from "./routes/EditProject";
import AddToGroups from "./routes/AddToGroups";
import DownloadCli from "./routes/downloadCli";
import NewUser from "./routes/NewUser";

const Users = ({ match }) => (
  <div className="">
    <HashRouter>
      <Switch>
        <Route exact path={`${match.url}`} component={UsersList} />
        <Route path={`${match.url}/cli`} component={DownloadCli} />
        <Route path={`${match.url}/new`} component={NewUser} />
        <Route
          exact
          path={`${match.url}/:userId/assigntoproject`}
          component={AssignToProject}
        />
        <Route
          exact
          path={`${match.url}/:userId/project/:projectId`}
          component={EditProject}
        />
        <Route
          exact
          path={`${match.url}/:userId/addtogroups`}
          component={AddToGroups}
        />
        <Route
          exact
          path={`${match.url}/:userId/keys`}
          component={ManageAPIKeys}
        />

        <Route path={`${match.url}/:userId`} component={UserDetail} />
      </Switch>
    </HashRouter>
  </div>
);

export default Users;

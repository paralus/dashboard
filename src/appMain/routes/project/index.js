import React from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import List from "./routes/List";
import ProjectDetail from "./routes/ProjectDetail";
import AssignGroup from "./routes/AssignGroup";
import AssignUser from "./routes/AssignUser";
import EditGroup from "./routes/EditGroup";
import EditUser from "./routes/EditUser";

const Project = ({ match }) => (
  <div className="">
    <HashRouter>
      <Switch>
        <Route exact path={`${match.url}`} component={List} />
        <Route
          path={`${match.url}/:projectId/assigngroup`}
          component={AssignGroup}
        />
        <Route
          path={`${match.url}/:projectId/assignuser`}
          component={AssignUser}
        />
        <Route
          path={`${match.url}/:projectId/users/:userId`}
          component={EditUser}
        />
        <Route
          path={`${match.url}/:projectId/groups/:groupId`}
          component={EditGroup}
        />
        <Route path={`${match.url}/:projectId`} component={ProjectDetail} />
      </Switch>
    </HashRouter>
  </div>
);

export default Project;

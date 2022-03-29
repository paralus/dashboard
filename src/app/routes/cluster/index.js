import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useRouteMatch } from "react-router";
import Provision from "./routes/Provision";

const Cluster = () => {
  const { url } = useRouteMatch();
  return (
    <div>
      <Route exact path={url}>
        <Redirect to="/app/edges" />
      </Route>
      <Route path={`${url}/provision`} component={Provision} />
    </div>
  );
};

export default Cluster;

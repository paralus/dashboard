import React from "react";
import { Route } from "react-router-dom";
import { useRouteMatch } from "react-router";
import Imported from "./routes/Imported";

const Cluster = () => {
  const { url } = useRouteMatch();
  return (
    <div>
      <Route exact path={`${url}/:cluster/imported`} component={Imported} />
    </div>
  );
};

export default Cluster;

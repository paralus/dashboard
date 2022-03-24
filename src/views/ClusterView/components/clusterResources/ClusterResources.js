import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core";

import { ClusterViewContext } from "../../ClusterViewContexts";
import IfThen from "../IfThen";
import RolesGrid from "../grids/RolesGrid";
import PersistentVolumesGrid from "../grids/PersistentVolumesGrid";
import StorageClassesGrid from "../grids/StorageClassesGrid";
import PSPGrid from "../grids/PSPGrid";
import ServiceAccountGrid from "../grids/ServiceAccountGrid";
import ClusterResourceList from "./ClusterResourceList";
import { useQuery } from "../../../../utils";
import RoleBindingGrid from "../grids/RoleBindingGrid";
import EventsGrid from "../grids/EventsGrid";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "220px 24px calc(100% - 244px)",
  },
}));

export default function ClusterResources({
  match,
  history,
  location,
  clusterDetailsMatch,
  filterContext,
}) {
  const classes = useStyles();
  const { edge, project } = useContext(ClusterViewContext);
  const { params } = match;
  const { ctype } = params;
  const { query } = useQuery();
  const noRedirect = query.get("noRedirect");
  const search = query.get("search");

  const handleListClick = (type) => {
    history.push(`/app/edges/${edge.id}/resources/cluster/${type}`);
  };

  //When there is no cluster type provided, show roles
  useEffect(() => {
    if (!ctype) handleListClick("roles");
  });

  //removing the noRedirect flag, in order to prevent namespace resource to be loaded
  useEffect(() => {
    history.replace(`${match.url}?search=${search}&view=Cluster`);
  }, [noRedirect]);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <div>
          <ClusterResourceList
            type={ctype}
            onClick={handleListClick}
            edgeId={edge.edge_id}
            location={location}
          />
        </div>
        <div />
        <div>
          <IfThen condition={ctype === "roles"}>
            <RolesGrid
              edge={edge.name}
              project={project?.id}
              match={clusterDetailsMatch}
              ctype={ctype}
              filterContext={filterContext}
            />
          </IfThen>
          <IfThen condition={ctype === "rolebindings"}>
            <RoleBindingGrid
              edge={edge.name}
              project={project?.id}
              match={clusterDetailsMatch}
              ctype={ctype}
              filterContext={filterContext}
            />
          </IfThen>
          <IfThen condition={ctype === "pv"}>
            <PersistentVolumesGrid
              edge={edge.name}
              project={project?.id}
              match={clusterDetailsMatch}
              filterContext={filterContext}
            />
          </IfThen>
          <IfThen condition={ctype === "storageclasses"}>
            <StorageClassesGrid
              edge={edge.name}
              project={project?.id}
              filterContext={filterContext}
            />
          </IfThen>
          <IfThen condition={ctype === "psp"}>
            <PSPGrid
              edge={edge.name}
              project={project?.id}
              filterContext={filterContext}
            />
          </IfThen>

          <IfThen condition={ctype === "events"}>
            <EventsGrid
              edge={edge.name}
              project={project?.id}
              ctype={ctype}
              filterContext={filterContext}
            />
          </IfThen>
        </div>
      </div>
    </React.Fragment>
  );
}

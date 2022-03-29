import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Breadcrumbs, Link, Typography, Box } from "@material-ui/core";
import { useQuery } from "../../../utils";

function getRoutes(edgeId) {
  return {
    clusters: "/app/edges",
    clusterDetails: `/app/edges/${edgeId}`,
    nodeDetails: `/app/edges/${edgeId}/nodes/:node`,
    podDetails: `/app/edges/${edgeId}/pods/:pod`,
    containerDetails: `/app/edges/${edgeId}/pods/:pod/containers/:container`,
  };
}

function getCrumbs({ path, params, url }, edge) {
  const edgeName = edge.name || "...";
  const routes = getRoutes(edge.id);
  const nodeName = ((edge.nodes || []).find((x) => x.id === params.node) || {})
    .name;

  const { query } = useQuery();
  const namespace = query.get("namespace");
  const namespaceQuery = namespace ? "?namespace=" + namespace : "";

  switch (path) {
    case routes.clusterDetails:
      return [{ text: "Clusters", to: routes.clusters }, { text: edgeName }];

    case routes.nodeDetails:
      return [
        { text: "Clusters", to: routes.clusters },
        { text: edgeName, to: `${routes.clusters}/${edge.id}` },
        {
          text: "Nodes",
          to: `${routes.clusters}/${edge.id}/nodes`,
        },
        { text: nodeName },
      ];

    case routes.podDetails:
      return [
        { text: "Clusters", to: routes.clusters },
        { text: edgeName, to: `${routes.clusters}/${edge.id}` },
        {
          text: "Pods",
          to: `${routes.clusters}/${edge.id}/resources/pods`,
        },
        { text: params.pod },
      ];
    case routes.containerDetails:
      return [
        { text: "Clusters", to: routes.clusters },
        { text: edgeName, to: `${routes.clusters}/${edge.id}` },
        {
          text: "Pods",
          to: `${routes.clusters}/${edge.id}/resources/pods`,
        },
        {
          text: params.pod,
          to: `${routes.clusters}/${edge.id}/pods/${params.pod}${namespaceQuery}`,
        },
        {
          text: "Containers",
          to: `${routes.clusters}/${edge.id}/pods/${params.pod}${namespaceQuery}`,
        },
        { text: params.container },
      ];

    default:
      return [{ text: "Clusters", to: routes.clusters }, { text: edgeName }];
  }
}

function getLink(text, to) {
  return (
    <Link key={text} component={RouterLink} to={to} color="inherit">
      {text}
    </Link>
  );
}

function getText(text, isLast) {
  return (
    <Typography key={text} color={isLast ? "textPrimary" : "textSecondary"}>
      {text}
    </Typography>
  );
}

export default function BackTracker({ match, edge = {} }) {
  const crumbs = getCrumbs(match, edge);
  return (
    <Box mb={2}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          if (!crumb.to) return getText(crumb.text, isLast);
          return getLink(crumb.text, crumb.to);
        })}
      </Breadcrumbs>
    </Box>
  );
}

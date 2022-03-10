import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core";

import { ClusterViewContext } from "../ClusterViewContexts";
import { ResourceFiltersContext } from "./ResourceFilters";
import ResourceList from "./ResourceList";
import IfThen from "./IfThen";
import PodGrid from "./grids/PodGrid";
import WorkloadGrid from "./grids/WorkloadGrid";
import NamespaceGrid from "./grids/NamespaceGrid";
import DeploymentsList from "./grids/DeploymentsList";
import ReplicaSets from "./grids/ReplicaSetsList";
import StatefulSetGrid from "./grids/StatefulSetGrid";
import DaemonsetGrid from "./grids/DaemonsetGrid";
import IngressGrid from "./grids/IngressGrid";
import ServicesList from "./grids/ServicesList";
import SecretGrid from "./grids/SecretGrid";
import HelmReleaseGrid from "./grids/HelmReleaseGrid";
import JobsGrid from "./grids/JobsGrid";
import CronJobsGrid from "./grids/CronJobsGrid";
import ConfigMapGrid from "./grids/ConfigMapGrid";
import PersistentVolumClaimGrid from "./grids/PersistentVolumeClaimsGrid";
import ClusterResources from "./clusterResources/ClusterResources";
import { useQuery, useSnack } from "../../../utils";
import ServiceAccountGrid from "./grids/ServiceAccountGrid";
import RolesGrid from "./grids/RolesGrid";
import RoleBindingGrid from "./grids/RoleBindingGrid";
import EventsGrid from "./grids/EventsGrid";
import VMsGrid from "./grids/VMsGrid";

const useStyles = makeStyles(theme => ({
  root: {
    display: "grid",
    gridTemplateColumns: "220px 24px calc(100% - 244px)"
  }
}));

export default function ResourcesTab({
  match,
  history,
  location,
  clusterDetailsMatch
}) {
  const classes = useStyles();
  const { a, edge, project } = useContext(ClusterViewContext);
  const filterContext = useContext(ResourceFiltersContext);
  const { selectedFilters } = filterContext;
  const { params } = match;
  const { type, ctype } = params;
  const selectedView = selectedFilters.view;
  const { query } = useQuery();
  const { showSnack } = useSnack();
  const noRedirect = query.get("noRedirect");
  const handleListClick = type => {
    history.push(`/app/edges/${edge.id}/resources/${type}`);
  };

  useEffect(() => {
    if (
      selectedView === "Namespaces" &&
      !noRedirect &&
      (type === "workloads" ||
        type === "helmreleases" ||
        (type === "cluster" && !!ctype))
    ) {
      handleListClick("namespaces");
    }
    if (
      selectedView === "Workloads" &&
      !noRedirect &&
      (type === "namespaces" ||
        type === "helmreleases" ||
        (type === "cluster" && !!ctype))
    ) {
      handleListClick("workloads");
    }
    if (selectedView === "Helm Releases" && type !== "helmreleases") {
      handleListClick("helmreleases");
    }
    if (selectedView === "Addons" && type === "helmreleases") {
      handleListClick("namespaces");
    }
  }, [selectedView, location.pathname]);

  const vmActions = {
    start: (name, namespace) => {
      return a
        .startVirtualMachine(edge.project_id, edge.name, namespace, name)
        .then(res => {
          showSnack(res.data?.output || JSON.stringify(res.data), "success");
        })
        .catch(err => {
          showSnack(
            err.response.data?.error || JSON.stringify(err.response.data)
          );
        });
    },
    stop: (name, namespace) => {
      return a
        .stopVirtualMachine(edge.project_id, edge.name, namespace, name)
        .then(res => {
          showSnack(res.data?.output || JSON.stringify(res.data), "success");
        })
        .catch(err => {
          showSnack(
            err.response.data?.error || JSON.stringify(err.response.data)
          );
        });
    },
    pause: (name, namespace) => {
      return a
        .pauseVirtualMachine(edge.project_id, edge.name, namespace, name)
        .then(res => {
          showSnack(res.data?.output || JSON.stringify(res.data), "success");
        })
        .catch(err => {
          showSnack(
            err.response.data?.error || JSON.stringify(err.response.data)
          );
        });
    },
    unpause: (name, namespace) => {
      return a
        .unpauseVirtualMachine(edge.project_id, edge.name, namespace, name)
        .then(res => {
          showSnack(res.data?.output || JSON.stringify(res.data), "success");
        })
        .catch(err => {
          showSnack(
            err.response.data?.error || JSON.stringify(err.response.data)
          );
        });
    },
    restart: (name, namespace) => {
      return a
        .restartVirtualMachine(edge.project_id, edge.name, namespace, name)
        .then(res => {
          showSnack(res.data?.output || JSON.stringify(res.data), "success");
        })
        .catch(err => {
          showSnack(
            err.response.data?.error || JSON.stringify(err.response.data)
          );
        });
    }
  };

  const vmOperatorEnabled =
    edge?.cluster?.metadata?.labels["rafay.dev/kubevirt"] === "enabled";

  return (
    <React.Fragment>
      <IfThen condition={type === "helmreleases"}>
        <HelmReleaseGrid edgeId={edge.edge_id} />
      </IfThen>
      <IfThen condition={type === "cluster"}>
        <ClusterResources
          match={match}
          history={history}
          edgeId={edge.edge_id}
          clusterDetailsMatch={clusterDetailsMatch}
          filterContext={filterContext}
        />
      </IfThen>
      <IfThen condition={type !== "helmreleases" && type !== "cluster"}>
        <div className={classes.root}>
          <div>
            <ResourceList
              type={type}
              onClick={handleListClick}
              edgeId={edge.edge_id}
              location={location}
              vmOperatorEnabled={vmOperatorEnabled}
            />
          </div>
          <div />
          <div>
            <IfThen condition={type === "workloads"}>
              <WorkloadGrid edge={edge} />
            </IfThen>
            <IfThen condition={type === "namespaces"}>
              <NamespaceGrid
                edgeId={edge.edge_id}
                project={edge.project_id}
                edgeName={edge.id}
                edge={edge.name}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "pods"}>
              <PodGrid
                edgeId={edge.edge_id}
                history={history}
                match={clusterDetailsMatch}
                filterContext={filterContext}
                edge={edge}
              />
            </IfThen>
            <IfThen condition={type === "deployments"}>
              <DeploymentsList
                edge={edge.name}
                project={edge.project_id}
                edgeId={edge.edge_id}
                edgeName={edge.id}
                filterContext={filterContext}
                // edge={edge}
              />
            </IfThen>
            <IfThen condition={type === "replicasets"}>
              <ReplicaSets
                edgeId={edge.edge_id}
                edgeName={edge.name}
                project={edge.project_id}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "statefulsets"}>
              <StatefulSetGrid
                edgeId={edge.edge_id}
                edgeName={edge.name}
                project={edge.project_id}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "daemonsets"}>
              <DaemonsetGrid
                edgeHash={edge.id}
                project={project?.id}
                edgeName={edge.name}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "ingress"}>
              <IngressGrid
                edge={edge.name}
                project={project?.id}
                edgeId={edge.edge_id}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "services"}>
              <ServicesList
                edge={edge.name}
                project={project?.id}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "jobs"}>
              <JobsGrid
                edge={edge.name}
                project={project?.id}
                match={clusterDetailsMatch}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "cronjobs"}>
              <CronJobsGrid
                edge={edge.name}
                project={project?.id}
                match={clusterDetailsMatch}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "secrets"}>
              <SecretGrid
                edge={edge.name}
                project={edge.project_id}
                edgeId={edge.edge_id}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "pvc"}>
              <PersistentVolumClaimGrid
                edge={edge.name}
                project={project?.id}
                match={clusterDetailsMatch}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "configmaps"}>
              <ConfigMapGrid
                edge={edge.name}
                project={project?.id}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "serviceaccounts"}>
              <ServiceAccountGrid
                edge={edge.name}
                project={project?.id}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "roles"}>
              <RolesGrid
                edge={edge.name}
                project={project?.id}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "rolebindings"}>
              <RoleBindingGrid
                edge={edge.name}
                project={project?.id}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "events"}>
              <EventsGrid
                edge={edge.name}
                project={project?.id}
                filterContext={filterContext}
              />
            </IfThen>
            <IfThen condition={type === "vms"}>
              <VMsGrid
                edge={edge.name}
                project={project?.id}
                filterContext={filterContext}
                actions={vmActions}
              />
            </IfThen>
          </div>
        </div>
      </IfThen>
    </React.Fragment>
  );
}

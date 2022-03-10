import React, { useContext, useEffect } from "react";
import * as R from "ramda";
import clsx from "clsx";
import {
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Paper,
  makeStyles
} from "@material-ui/core";

import Fetcher from "components/Fetcher";
import { ResourceFiltersContext } from "./ResourceFilters";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles(theme => ({
  counts: {
    display: "grid",
    gridTemplateColumns: "28px 28px",
    gridColumnGap: 8,
    direction: "rtl"
  },
  subheader: {
    background: "white",
    color: theme.palette.text.primary,
    paddingLeft: 0,
    cursor: "pointer"
  },
  listItem: {
    paddingLeft: 8,
    paddingRight: 8
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    padding: "0 6px",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9em",
    fontWeight: 500
  },
  primary: {
    backgroundColor: theme.palette.success.light
  },
  error: {
    backgroundColor: theme.palette.error.light
  },
  default: {
    backgroundColor: theme.palette.text.disabled
  },
  expandIcon: { marginTop: 12, float: "right" }
}));

function Badge({ count = 0, color }) {
  const classes = useStyles();
  return (
    <div className={clsx(classes.badge, classes[count ? color : "default"])}>
      {count > 99 ? "99+" : count}
    </div>
  );
}

function Counts({ healthy, unhealthy, total, showTotal = false }) {
  const classes = useStyles();
  return (
    <div className={classes.counts}>
      {showTotal ? (
        <Badge count={total} color="primary" />
      ) : (
        <React.Fragment>
          <Badge count={unhealthy} color="error" />
          <Badge count={healthy} color="primary" />
        </React.Fragment>
      )}
    </div>
  );
}

const subHeadersOpen = {
  deployment: true,
  loadBalancer: false,
  config: false,
  accessControl: false
};

export default function ResourceList({
  type,
  onClick,
  edgeId,
  vmOperatorEnabled
}) {
  const classes = useStyles();
  const [sectionsOpened, setSectionsOpened] = React.useState(subHeadersOpen);
  const { selectedFilters, refreshInterval } = useContext(
    ResourceFiltersContext
  );
  const handleClick = key => e => {
    if (onClick) onClick(key);
    e.stopPropagation();
  };

  const handleSectionCollapse = section => {
    const opened = Object.assign({}, sectionsOpened);
    opened[section] = !opened[section];
    setSectionsOpened(opened);
  };
  const getListItem = (data, showTotal) => ({ label, key, dataKey }) => {
    return (
      <ListItem
        button
        key={key}
        selected={type === key}
        onClick={handleClick(key)}
        className={classes.listItem}
      >
        <ListItemText
          primary={label}
          primaryTypographyProps={{ variant: "body2" }}
        />
        {/* {data && (
          <Counts
            showTotal={showTotal}
            healthy={R.path([dataKey, "healthy"], data)}
            unhealthy={R.path([dataKey, "unhealthy"], data)}
            total={R.path([dataKey, "total"], data)}
          />
        )} */}
      </ListItem>
    );
  };
  const getSimpleListItem = ({ label, key }) => {
    return (
      <ListItem
        button
        key={key}
        selected={type === key}
        onClick={handleClick(key)}
        className={classes.listItem}
      >
        <ListItemText
          primary={label}
          primaryTypographyProps={{ variant: "body2" }}
        />
      </ListItem>
    );
  };
  const getQueryParam = () => {
    if (selectedFilters.view === "Namespaces") {
      return selectedFilters.namespace !== "All"
        ? `&namespace=${selectedFilters.namespace}&namespaceGroup=${selectedFilters.namespaceGroup}`
        : `&namespaceGroup=${selectedFilters.namespaceGroup}`;
    } else if (selectedFilters.view === "Workloads") {
      return `&workload=${selectedFilters.workload}`;
    } else return `&addon=${selectedFilters.addon}`;
  };

  return (
    <Paper elevation={0}>
      <Fetcher
        refreshInterval={refreshInterval}
        fetchArgs={[
          `resources/health_counts?edgeId=${edgeId}${getQueryParam()}`
        ]}
      >
        {({ data = {} }) => {
          return (
            <React.Fragment>
              <List component="nav">
                {[
                  {
                    label: "Workloads",
                    key: "workloads",
                    dataKey: "Workload"
                  },
                  {
                    label: "Namespaces",
                    key: "namespaces",
                    dataKey: "Namespace"
                  }
                ]
                  .filter(i => i.label === selectedFilters.view)
                  .map(getListItem(data))}
              </List>
              {selectedFilters.view === "Namespaces" && (
                <List component="nav">
                  {getSimpleListItem({
                    label: "Events",
                    key: "events"
                  })}
                </List>
              )}

              <List
                component="nav"
                onClick={() => handleSectionCollapse("deployment")}
                subheader={
                  <>
                    <ListSubheader
                      component="div"
                      className={classes.subheader}
                    >
                      Deployment Resources
                      {sectionsOpened.deployment ? (
                        <ExpandLess className={classes.expandIcon} />
                      ) : (
                        <ExpandMore className={classes.expandIcon} />
                      )}
                    </ListSubheader>
                  </>
                }
              >
                <Collapse
                  in={sectionsOpened.deployment}
                  timeout="auto"
                  unmountOnExit
                >
                  <>
                    {[
                      {
                        label: "Pods",
                        key: "pods",
                        dataKey: "Pod"
                      },
                      {
                        label: "Deployments",
                        key: "deployments",
                        dataKey: "Deployment"
                      },
                      {
                        label: "Replica Sets",
                        key: "replicasets",
                        dataKey: "ReplicaSet"
                      },
                      {
                        label: "Stateful Sets",
                        key: "statefulsets",
                        dataKey: "StatefulSet"
                      },
                      {
                        label: "Daemon Sets",
                        key: "daemonsets",
                        dataKey: "DaemonSet"
                      }
                    ].map(getListItem(data))}
                    {[
                      {
                        label: "Jobs",
                        key: "jobs"
                      },
                      {
                        label: "Cron Jobs",
                        key: "cronjobs"
                      }
                    ].map(getSimpleListItem)}
                    {vmOperatorEnabled &&
                      getSimpleListItem({
                        label: "Virtual Machines",
                        key: "vms"
                      })}
                  </>
                </Collapse>
              </List>
              <List
                component="nav"
                onClick={() => handleSectionCollapse("loadBalancer")}
                subheader={
                  <ListSubheader component="div" className={classes.subheader}>
                    Load Balancers
                    {sectionsOpened.loadBalancer ? (
                      <ExpandLess className={classes.expandIcon} />
                    ) : (
                      <ExpandMore className={classes.expandIcon} />
                    )}
                  </ListSubheader>
                }
              >
                <Collapse
                  in={sectionsOpened.loadBalancer}
                  timeout="auto"
                  unmountOnExit
                >
                  <>
                    {[
                      {
                        label: "Ingress",
                        key: "ingress",
                        dataKey: "Ingress"
                      },
                      {
                        label: "Services",
                        key: "services",
                        dataKey: "Service"
                      }
                    ].map(getListItem(data, true))}
                  </>
                </Collapse>
              </List>
              <List
                component="nav"
                onClick={() => handleSectionCollapse("config")}
                subheader={
                  <ListSubheader component="div" className={classes.subheader}>
                    Config & Storage
                    {sectionsOpened.config ? (
                      <ExpandLess className={classes.expandIcon} />
                    ) : (
                      <ExpandMore className={classes.expandIcon} />
                    )}
                  </ListSubheader>
                }
              >
                <Collapse
                  in={sectionsOpened.config}
                  timeout="auto"
                  unmountOnExit
                >
                  <>
                    {[
                      {
                        label: "Secrets",
                        key: "secrets",
                        dataKey: "Secret"
                      },
                      {
                        label: "PVCs",
                        key: "pvc",
                        dataKey: "PVC"
                      }
                    ].map(getListItem(data, true))}
                    {[
                      {
                        label: "Config Maps",
                        key: "configmaps"
                      }
                    ].map(getSimpleListItem)}
                  </>
                </Collapse>
              </List>
              <List
                component="nav"
                onClick={() => handleSectionCollapse("accessControl")}
                subheader={
                  <ListSubheader component="div" className={classes.subheader}>
                    Access Control
                    {sectionsOpened.accessControl ? (
                      <ExpandLess className={classes.expandIcon} />
                    ) : (
                      <ExpandMore className={classes.expandIcon} />
                    )}
                  </ListSubheader>
                }
              >
                <Collapse
                  in={sectionsOpened.accessControl}
                  timeout="auto"
                  unmountOnExit
                >
                  <>
                    {[
                      {
                        label: "Roles",
                        key: "roles"
                      },
                      {
                        label: "Role Bindings",
                        key: "rolebindings"
                      },
                      {
                        label: "Service Accounts",
                        key: "serviceaccounts"
                      }
                    ].map(getSimpleListItem)}
                  </>
                </Collapse>
              </List>
            </React.Fragment>
          );
        }}
      </Fetcher>
    </Paper>
  );
}

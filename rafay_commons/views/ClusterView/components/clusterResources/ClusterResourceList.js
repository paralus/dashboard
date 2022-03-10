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
import { ResourceFiltersContext } from "../ResourceFilters";

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
    paddingLeft: 0
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
  }
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

export default function ClusterResourceList({ type, onClick, edgeId }) {
  const classes = useStyles();
  const { selectedFilters, refreshInterval } = useContext(
    ResourceFiltersContext
  );
  const handleClick = key => e => {
    if (onClick) onClick(key);
  };
  // const getListItem = (data, showTotal) => ({ label, key, dataKey }) => {
  //   return (
  //     <ListItem
  //       button
  //       key={key}
  //       selected={type === key}
  //       onClick={handleClick(key)}
  //       className={classes.listItem}
  //     >
  //       <ListItemText
  //         primary={label}
  //         primaryTypographyProps={{ variant: "body2" }}
  //       />
  //       {data && (
  //         <Counts
  //           showTotal={showTotal}
  //           healthy={R.path([dataKey, "healthy"], data)}
  //           unhealthy={R.path([dataKey, "unhealthy"], data)}
  //           total={R.path([dataKey, "total"], data)}
  //         />
  //       )}
  //     </ListItem>
  //   );
  // };
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
    }
    return `&workload=${selectedFilters.workload}`;
  };

  return (
    <Paper elevation={0}>
      <React.Fragment>
        <List component="nav">
          {getSimpleListItem({
            label: "Events",
            key: "events"
          })}
        </List>
        <List
          component="nav"
          subheader={
            <ListSubheader component="div" className={classes.subheader}>
              Cluster Resources
            </ListSubheader>
          }
        >
          {[
            {
              label: "Roles",
              key: "roles"
              // dataKey: "Role"
            },
            {
              label: "Role Bindings",
              key: "rolebindings"
              // dataKey: "Role"
            },
            {
              label: "Persistent Volumes",
              key: "pv"
              // dataKey: "PersistentVolume"
            },
            {
              label: "Storage Classes",
              key: "storageclasses"
              // dataKey: "StorageClass"
            },
            {
              label: "PSP",
              key: "psp"
              // dataKey: "PSP"
            }
            // {
            //   label: "Service Accounts",
            //   key: "serviceaccounts"
            //   // dataKey: "serviceaccounts"
            // }
          ].map(getSimpleListItem)}
        </List>
      </React.Fragment>
    </Paper>
  );
}

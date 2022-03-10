import React, { useState, useEffect } from "react";
import * as R from "ramda";
import Select from "react-select";
import {
  Typography,
  Box,
  makeStyles,
  FormControl,
  InputLabel,
  Select as MSelect,
  MenuItem
} from "@material-ui/core";

import Fetcher from "components/Fetcher";
import Spinner from "components/Spinner";
import { useHistory } from "react-router-dom";
import { useQuery } from "../../../utils";

const useStyles = makeStyles(theme => ({
  resourceFilterProvider: {},
  resourceFilterBox: {
    marginBottom: theme.spacing(2)
  },
  filter: {
    flex: 1,
    minWidth: 200,
    marginRight: theme.spacing(1),
    zIndex: 1090
  }
}));

const INTERVAL_OPTIONS = [
  { label: "None", value: 0 },
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "2m", value: 120 },
  { label: "5m", value: 300 }
];

/* Helpers */

const isRafayNamespace = R.anyPass([
  R.equals("kube-system"),
  R.equals("rafay-system"),
  R.equals("rafay-infra")
]);

const memoNsPredicate = R.memoizeWith(R.identity, ns => {
  return R.propEq("namespace", ns);
});

const memoWlPredicate = R.memoizeWith(R.identity, wl => {
  return R.anyPass([
    R.propEq("label_rep_workload", wl),
    R.propEq("rep-workload", wl)
  ]);
});

const memoAddonPredicate = R.memoizeWith(R.identity, ad => {
  return R.anyPass([
    R.propEq("label_rep_addon", ad),
    R.propEq("rep-addon", ad)
  ]);
});

const managedPredicate = R.anyPass([
  R.has("label_rep_workload"),
  R.has("rep-workload")
]);

const managedAddonPredicate = R.anyPass([
  R.has("label_rep_addon"),
  R.has("rep-addon")
]);

const managedNamespace = R.anyPass([
  R.propSatisfies(isRafayNamespace, "namespace"),
  managedPredicate
]);

const unmanagedNamespace = R.complement(managedNamespace);

function Filter({ label, ...rest }) {
  return (
    <Box zIndex={1090}>
      <Typography
        variant="caption"
        style={{ marginBottom: 2 }}
        color="textSecondary"
      >
        {label}
      </Typography>
      <Select {...rest} />
    </Box>
  );
}

const getAddonsFromSnapshots = bpVersion =>
  R.pipe(
    R.pathOr([], ["items"]),
    R.filter(snapshot =>
      R.equals(R.path(["metadata", "displayName"])(snapshot), bpVersion)
    ),
    R.head,
    R.pathOr([], ["spec", "components"]),
    R.map(addon => addon.name)
  );

const getDefaultAddonsFromSnapshots = R.pipe(
  R.pathOr([], ["spec", "components"]),
  R.map(addon => addon.name)
);

export const ResourceFiltersContext = React.createContext();

const DEFAULT_BP_URL =
  "v2/config/project/-/blueprint/default/published?metadata.requestMeta.globalScope=true";
const makeBPVersionsUrl = (projectId, bp) =>
  `/v2/config/project/${projectId}/blueprint/${bp}/snapshot?options.limit=10&options.offset=0&options.order=DESC&options.orderby=created_at`;
const makeNamespaceWorkloadUrl = edgeId =>
  `resources/namespaces_workloads?edgeId=${edgeId}`;

function ResourceFiltersInner({
  children,
  loading,
  refreshInterval,
  updateInterval,
  edgeId,
  data: { namespaces = [], workloads = [], addons = [] }
}) {
  const classes = useStyles();
  const { query } = useQuery();
  const [isDefaultSet, setDefaultFlag] = useState(!loading);
  const queryView = query.get("view");
  const queryWl = query.get("workload");
  const queryNs = query.get("namespace");
  const isLoading = !isDefaultSet;
  const history = useHistory();

  /* View By Selection */
  const viewByOptions = [
    { label: "Cluster", value: R.identity },
    { label: "Namespaces", value: R.T },
    { label: "Workloads", value: managedPredicate },
    { label: "Helm Releases", value: R.F },
    { label: "Addons", value: managedAddonPredicate }
  ];
  const [selectedView, setView] = useState(
    R.find(R.propEq("label", queryView || "Namespaces"), viewByOptions)
  );
  const handleViewChange = type => setView(type);
  const updateView = label => {
    const option = R.find(R.propEq("label", label), viewByOptions);
    handleViewChange(option);
  };

  /* Namespace Group Selection */
  const namespaceGroupOptions = [
    { label: "All", value: R.T },
    { label: "Managed", value: managedNamespace },
    { label: "Unmanaged", value: unmanagedNamespace }
  ];
  const [selectedNamespaceGroup, setNamespaceGroup] = useState(
    namespaceGroupOptions[0]
  );
  const handleNsgChange = nsg => setNamespaceGroup(nsg);
  const updateNsg = label => {
    const option = R.find(R.propEq("label", label), namespaceGroupOptions);
    handleNsgChange(option);
  };

  /* Namespace Selection */
  const namespaceOptions = R.pipe(
    R.filter(selectedNamespaceGroup.value),
    R.map(ns => ({
      label: ns.namespace,
      value: memoNsPredicate(ns.namespace)
    })),
    R.concat([{ label: "All", value: R.T }])
  )(namespaces);
  const defaultNamespace = R.cond([
    [R.propEq("length", 1), R.head],
    [() => !!queryNs, R.find(R.propEq("label", queryNs))],
    [
      R.T,
      R.ifElse(
        R.always(selectedNamespaceGroup.label !== "Unmanaged"),
        R.find(R.propEq("label", "kube-system")),
        R.find(R.propEq("label", "All"))
      )
    ]
  ])(namespaceOptions);
  const [selectedNamespace, setNamespace] = useState(defaultNamespace);
  const handleNsChange = ns => setNamespace(ns);
  const updateNamespace = label => {
    const option = R.find(R.propEq("label", label), namespaceOptions);
    handleNsChange(option);
  };

  /* Workload Selection */
  const workloadOptions = R.pipe(
    R.map(wl => ({ label: wl, value: memoWlPredicate(wl) })),
    R.concat([{ label: "All", value: R.T }])
  )(workloads);

  const [selectedWorkload, setWorkload] = useState(workloadOptions[0]);
  const handleWlChange = wl => setWorkload(wl);
  const updateWorkload = label => {
    const option = R.find(R.propEq("label", label), workloadOptions);
    handleWlChange(option);
  };

  /* Addon Selection */
  const addonOptions = R.pipe(
    R.map(ad => ({ label: ad, value: memoAddonPredicate(ad) })),
    R.concat([{ label: "All", value: R.T }])
  )(addons);

  const [selectedAddon, setAddon] = useState(addonOptions[0]);
  const handleAddonChange = ad => setAddon(ad);
  const updateAddon = label => {
    const option = R.find(R.propEq("label", label), addonOptions);
    setAddon(option);
  };

  const applyResourceFilters = R.transduce(
    R.pipe(
      R.filter(selectedView.value),
      R.filter(selectedNamespaceGroup.value),
      R.filter(selectedNamespace.value),
      R.filter(selectedWorkload.value),
      R.filter(selectedAddon.value)
    ),
    R.flip(R.append),
    []
  );

  const applyZtkResourceFilters = data => {
    let rData = data;
    const workload = selectedWorkload.label;
    const addon = selectedAddon.label;
    if (selectedView?.label === "Workloads" && workload) {
      if (workload === "All") {
        rData = rData?.filter(v => v.metadata.labels?.["rep-workload"]);
      } else {
        rData = rData?.filter(
          v => v.metadata.labels?.["rep-workload"] === workload
        );
      }
    }
    if (selectedView?.label === "Addons" && addon) {
      if (addon === "All") {
        rData = rData?.filter(v => v.metadata.labels?.["rep-addon"]);
      } else {
        rData = rData?.filter(v => v.metadata.labels?.["rep-addon"] === addon);
      }
    }
    return rData || [];
  };

  useEffect(() => {
    if (!loading) {
      setNamespace(defaultNamespace);
      setDefaultFlag(true);
    }
  }, [R.toString(namespaceOptions)]);

  useEffect(() => {
    if (queryWl && queryWl === "All") {
      setNamespace(namespaceOptions[0]);
    }
    if (workloads.length > 0 && queryWl && queryWl !== "All") {
      const queryWlOption = R.find(R.propEq("label", queryWl), workloadOptions);
      if (queryWlOption) setWorkload(queryWlOption);
      setNamespace(namespaceOptions[0]);
    }
  }, [workloads, queryWl]);

  useEffect(() => {
    if (selectedView.label === "Workloads") {
      setNamespaceGroup(namespaceGroupOptions[0]);
      setNamespace(namespaceOptions[0]);
    } else {
      setWorkload(workloadOptions[0]);
    }
    if (selectedView.label === "Cluster" && queryView !== "Cluster") {
      history.push(`/app/edges/${edgeId}/resources/cluster`);
    }

    if (selectedView.label === "Addons") {
      setNamespace(namespaceOptions[0]);
      setWorkload(workloadOptions[0]);
    } else if (selectedAddon.label !== "All") {
      setAddon(addonOptions[0]);
    }
  }, [selectedView]);

  useEffect(() => {
    if (queryView) updateView(queryView);
  }, [queryView]);

  return (
    <Box className={classes.resourceFilterProvider}>
      <Box
        display="flex"
        alignItems="flex-end"
        className={classes.resourceFilterBox}
      >
        <Filter
          label="Show Resources By"
          className={classes.filter}
          isDisabled={isLoading}
          isLoading={isLoading}
          value={selectedView}
          options={viewByOptions}
          onChange={handleViewChange}
        />
        {/* {selectedView.label !== "Cluster" &&
          selectedView.label === "Namespaces" && (
            <Filter
              label="Namespace Group"
              className={classes.filter}
              isDisabled={isLoading}
              isLoading={isLoading}
              value={selectedNamespaceGroup}
              options={namespaceGroupOptions}
              onChange={handleNsgChange}
            />
          )} */}
        {selectedView.label !== "Cluster" &&
          selectedView.label === "Namespaces" && (
            <Filter
              label="Namespace"
              isSearchable
              className={classes.filter}
              isDisabled={isLoading}
              isLoading={isLoading}
              value={selectedNamespace}
              options={namespaceOptions}
              onChange={handleNsChange}
            />
          )}
        {selectedView.label !== "Cluster" &&
          selectedView.label === "Workloads" && (
            <Filter
              label="Workload"
              isSearchable
              className={classes.filter}
              isDisabled={isLoading}
              isLoading={isLoading}
              value={selectedWorkload}
              options={workloadOptions}
              onChange={handleWlChange}
            />
          )}

        {selectedView.label !== "Cluster" &&
          selectedView.label === "Addons" && (
            <Filter
              label="Addon"
              isSearchable
              className={classes.filter}
              isDisabled={isLoading}
              isLoading={isLoading}
              value={selectedAddon}
              options={addonOptions}
              onChange={handleAddonChange}
            />
          )}
        <div style={{ flex: 1 }} />
        <FormControl size="small" variant="outlined" style={{ width: 200 }}>
          <InputLabel id="interval-label">Refresh Interval</InputLabel>
          <MSelect
            displayEmpty
            id="interval"
            labelId="interval-label"
            value={refreshInterval}
            onChange={updateInterval}
            label="Refresh Interval"
          >
            {INTERVAL_OPTIONS.map(option => (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </MSelect>
        </FormControl>
      </Box>
      <ResourceFiltersContext.Provider
        value={{
          refreshInterval,
          applyResourceFilters,
          applyZtkResourceFilters,
          isLoading,
          selectedFilters: {
            view: selectedView.label,
            namespaceGroup: selectedNamespaceGroup.label,
            namespace: selectedNamespace.label,
            workload: selectedWorkload.label,
            addon: selectedAddon.label
          },
          updateFilters: {
            view: updateView,
            namespaceGroup: updateNsg,
            namespace: updateNamespace,
            workload: updateWorkload
          }
        }}
      >
        <Spinner hideChildren loading={isLoading}>
          {children}
        </Spinner>
      </ResourceFiltersContext.Provider>
    </Box>
  );
}

export default function ResourceFilterProvider({ edge, children }) {
  const [refreshInterval, setRefreshInterval] = useState(
    INTERVAL_OPTIONS[2].value
  );
  const updateInterval = e => {
    setRefreshInterval(e.target.value);
  };

  const isDefaultBP = ["default", "v2-stripped"].includes(
    edge.cluster_blueprint
  );

  const aggregateAddons = isDefaultBP
    ? getDefaultAddonsFromSnapshots
    : getAddonsFromSnapshots(edge.cluster_blueprint_version);

  const makeSnapshotUrl = () => {
    if (isDefaultBP) {
      return [DEFAULT_BP_URL];
    }
    return [makeBPVersionsUrl(edge.project_id, edge.cluster_blueprint)];
  };

  return (
    <Fetcher
      refreshInterval={refreshInterval}
      handleResolution={data => {
        const addons = aggregateAddons(data[1]);
        return {
          namespaces: data[0]?.namespaces,
          workloads: data[0]?.workloads,
          addons
        };
      }}
      fetchArgs={[[makeNamespaceWorkloadUrl(edge.edge_id)], makeSnapshotUrl()]}
    >
      {({ data = {}, loading = true }) => {
        return (
          <ResourceFiltersInner
            data={data}
            loading={loading}
            refreshInterval={refreshInterval}
            updateInterval={updateInterval}
            edgeId={edge.id}
          >
            <Spinner loading={loading}>{children}</Spinner>
          </ResourceFiltersInner>
        );
      }}
    </Fetcher>
  );
}

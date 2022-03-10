import React, { useContext } from "react";
import * as R from "ramda";
import { Typography, Box } from "@material-ui/core";
import DateFormat from "../../../../components/DateFormat";
import Fetcher from "../../../../components/Fetcher";
import DataGrid from "../../../../components/DataGrid";
import {
  readStatusByPods,
  getHealthyPodsCount,
  renderHealthyPodsCount
} from "../../../../utils";
import useHealth from "../useHealth";
import RadioButtons from "../RadioButtons";
import { ResourceFiltersContext } from "../ResourceFilters";

// TODO: Update this method using Ramda
function parseHostname(workload) {
  if (!workload.ingress_enabled || !workload.ingress[0]) {
    return <span style={{ color: "lightgrey" }}>N/A</span>;
  }
  if (
    workload.ingress[0] &&
    ["TCPIngress", "UDPIngress"].includes(workload.ingress[0].ingress_type)
  ) {
    return workload.ingress.map((p, i) => (
      <span key={i}>
        {p.host ? p.host : "Not Configured"}
        <br />
      </span>
    ));
  }
  return workload.ingress.map((p, i) =>
    p.domain === "CustomDomain" ? (
      <span key={i}>
        <a key={`a-${i}`} href={`https://${p.host}`} target="_blank">
          https://
          {p.host}
        </a>
        <br />
      </span>
    ) : (
      <span key={i}>
        <a key={`a-${i}`} href={`https://${p.cname}`} target="_blank">
          https://
          {p.cname}
          <br />
        </a>
      </span>
    )
  );
}

function WorkloadGrid({ edge }) {
  const { edge_id: edgeId, id: edgeName, project_id, name: clusterName } = edge;
  const { status, statusOptions, updateStatus, filterByHealth } = useHealth();
  const { applyResourceFilters, refreshInterval } = useContext(
    ResourceFiltersContext
  );

  const applyFilters = R.pipe(applyResourceFilters, filterByHealth);

  const handleResponses = responses => {
    const [workloads, summaries, podWlData] = responses;
    const workloadsData = summaries.workloads
      .reduce((accumulator, current) => {
        const index = workloads.results.findIndex(
          w => w.name === current.workloadName
        );
        if (index > -1) {
          return [...accumulator, workloads.results[index]];
        }
        return accumulator;
      }, [])
      .filter(R.propEq("published", true));

    const getMetricData = R.pipe(R.groupBy(R.prop("workload")));
    const res = getMetricData(podWlData);
    const updatedWlData = R.map(wl => {
      const wlMetricData = R.propOr({}, wl.name, res);
      return R.mergeRight(
        { ...wl, label_rep_workload: wl.name },
        wlMetricData[0]
      );
    }, workloadsData);

    return updatedWlData;
  };

  return (
    <Fetcher
      refreshInterval={refreshInterval}
      handleResolution={handleResponses}
      fetchArgs={[
        [
          `config/v1/projects/${project_id}/workloads/?edgeId=${edgeId}&limit=10000`
        ],
        [
          `v2/scheduler/project/${project_id}/cluster/${clusterName}/workloadsummary?workloadType=custom`
        ],
        [`info/workload/?edgeId=${edgeId}`]
      ]}
    >
      {({ data = [], loading: wlLoading = true }) => {
        return (
          <div style={{ position: "relative", width: "100%" }}>
            <DataGrid
              resetPageOnChange={status}
              elevation={0}
              data={applyFilters(data)}
              loading={wlLoading}
              title={
                <Box display="flex" width="100%" mr={1}>
                  <Typography variant="h6">Workloads</Typography>
                  <div style={{ flex: 1 }} />
                  <RadioButtons
                    value={status}
                    options={statusOptions}
                    onClick={updateStatus}
                  />
                </Box>
              }
              defaultPageSize={10}
              defaultOrder="asc"
              defaultOrderBy="namespace"
              columns={[
                {
                  label: "Namespace",
                  dataKey: "namespace"
                },
                {
                  label: "Name",
                  dataKey: "name"
                },
                {
                  label: "Package Type",
                  dataKey: "type"
                },
                {
                  label: "Hostname",
                  dataKey: "hostname",
                  render({ rowData }) {
                    return parseHostname(rowData);
                  }
                },
                {
                  label: "Pods Ready",
                  dataKey: "healthyPods",
                  dataGetter: getHealthyPodsCount,
                  render: renderHealthyPodsCount(edgeName)
                },
                {
                  label: "Pods Status",
                  dataKey: "status",
                  render: readStatusByPods
                },
                {
                  label: "Published Date",
                  dataKey: "modified_at",
                  render({ rowData }) {
                    return <DateFormat date={rowData.modified_at} />;
                  }
                }
              ]}
            />
          </div>
        );
      }}
    </Fetcher>
  );
}

export default WorkloadGrid;

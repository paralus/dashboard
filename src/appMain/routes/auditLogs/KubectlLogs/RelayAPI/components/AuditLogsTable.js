import React from "react";
import { Paper } from "@material-ui/core";
import DateFormat from "components/DateFormat";
import DataTable from "components/TableComponents/DataTable";
import TableToolbar from "./TableToolbar";

const columnLabels = [
  { label: "Date" },
  { label: "User" },
  { label: "Project" },
  { label: "Cluster" },
  { label: "Namespace" },
  { label: "Resource" },
  { label: "Method" },
  { label: "Access Method" },
  { label: "Details" },
];

const AuditLogsTable = (props) => {
  const parseRowData = (data, index) => [
    {
      type: "regular",
      value: <DateFormat timestamp={data._source.json.timestamp} />,
      stringValue: data._source.json.timestamp,
    },
    {
      type: "regular",
      value: data._source.json.username || "-",
    },
    {
      type: "regular",
      value: data._source.json.project || "-",
    },
    {
      type: "regular",
      value: data._source.json.cluster_name || "-",
    },
    {
      type: "regular",
      value: data._source.json.namespace || "-",
    },
    {
      type: "regular",
      value: (
        <>
          <div>
            <b className="mr-2">Name:</b>
            <span>{data._source.json.name || "-"}</span>
          </div>
          <div>
            <b className="mr-2">Kind:</b>
            <span>{data._source.json.kind || "-"}</span>
          </div>
        </>
      ),
    },
    {
      type: "regular",
      value: data._source.json.method || "-",
    },
    {
      type: "regular",
      value: data._source.json.session_type || "-",
    },
    {
      type: "regular",
      style: { fontSize: "smaller" },
      value: (
        <>
          <div>
            <b className="mr-2">APIVersion:</b>
            <span>{data._source.json.api_version || "-"}</span>
          </div>
          <div>
            <b className="mr-2">Query:</b>
            <span>{data._source.json.query || "-"}</span>
          </div>
          <div>
            <b className="mr-2">RemoteAddr:</b>
            <span>{data._source.json.remote_addr || "-"}</span>
          </div>
          <div>
            <b className="mr-2">StatusCode:</b>
            <span>{data._source.json.status_code || "-"}</span>
          </div>
          <div>
            <b className="mr-2">Duration (secs):</b>
            <span>{data._source.json.duration || "-"}</span>
          </div>
        </>
      ),
    },
  ];

  const headerMapping = {
    timestamp: "Date",
    username: "User",
    project: "Project",
    cluster_name: "Cluster",
    namespace: "Namespace",
    name: "Resource Name",
    kind: "Resource Kind",
    method: "Method",
    session_type: "Access Method",
    api_version: "API Version",
    query: "Query",
    remote_addr: "Remote Address",
    status_code: "Status Code",
    duration: "Duration (secs)",
    organization_id: "Organisation Id",
    partner_id: "Partner Id",
  };

  return (
    <Paper>
      <TableToolbar
        handleRefreshClick={props.handleRefreshClick}
        handleFilter={props.handleFilter}
        handleResetFilter={props.handleResetFilter}
        users={props.users}
        clusters={props.clusters}
        projects={props.projects}
        isProjectRole={props.isProjectRole}
        namespaces={props.namespaces}
        kinds={props.kinds}
        methods={props.methods}
        filter={props.filter}
        list={props.list || []}
        headerMapping={headerMapping}
        handleRemoveFilter={props?.handleRemoveFilter}
      />
      <DataTable
        list={props.list || []}
        count={props.count}
        columnLabels={columnLabels}
        parseRowData={parseRowData}
      />
    </Paper>
  );
};

export default AuditLogsTable;

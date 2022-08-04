import React from "react";
import { Paper } from "@material-ui/core";
import DateFormat from "components/DateFormat";
import DataTable from "components/TableComponents/DataTable";
import TableToolbar from "./TableToolbar";

const columnLabels = [
  { label: "Date" },
  { label: "User" },
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
      value: <DateFormat timestamp={data._source.json.ts} />,
      stringValue: data._source.json.ts,
    },
    {
      type: "regular",
      value: data._source.json.un || "-",
    },
    {
      type: "regular",
      value: data._source.json.cn || "-",
    },
    {
      type: "regular",
      value: data._source.json.ns || "-",
    },
    {
      type: "regular",
      value: (
        <>
          <div>
            <b className="mr-2">Name:</b>
            <span>{data._source.json.n || "-"}</span>
          </div>
          <div>
            <b className="mr-2">Kind:</b>
            <span>{data._source.json.k || "-"}</span>
          </div>
        </>
      ),
    },
    {
      type: "regular",
      value: data._source.json.m || "-",
    },
    {
      type: "regular",
      value: data._source.json.st || "-",
    },
    {
      type: "regular",
      style: { fontSize: "smaller" },
      value: (
        <>
          <div>
            <b className="mr-2">APIVersion:</b>
            <span>{data._source.json.av || "-"}</span>
          </div>
          <div>
            <b className="mr-2">Query:</b>
            <span>{data._source.json.q || "-"}</span>
          </div>
          <div>
            <b className="mr-2">RemoteAddr:</b>
            <span>{data._source.json.ra || "-"}</span>
          </div>
          <div>
            <b className="mr-2">StatusCode:</b>
            <span>{data._source.json.sc || "-"}</span>
          </div>
          <div>
            <b className="mr-2">Duration (secs):</b>
            <span>{data._source.json.d || "-"}</span>
          </div>
        </>
      ),
    },
  ];

  const headerMapping = {
    ts: "Date",
    un: "User",
    cn: "Cluster",
    ns: "Namespace",
    n: "Resource Name",
    k: "Resource Kind",
    m: "Method",
    st: "Access Method",
    av: "API Version",
    q: "Query",
    ra: "Remote Address",
    sc: "Status Code",
    d: "Duration (secs)",
    o: "Organisation Id",
    p: "Partner Id",
  };

  return (
    <Paper>
      <TableToolbar
        handleRefreshClick={props.handleRefreshClick}
        handleFilter={props.handleFilter}
        handleResetFilter={props.handleResetFilter}
        users={props.users}
        clusters={props.clusters}
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

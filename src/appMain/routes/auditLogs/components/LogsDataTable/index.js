import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import ReactJson from "react-json-view";
import DateFormat from "components/DateFormat";
import DataTable from "components/RafayTable/DataTable";
import TableToolbar from "./TableToolbar";

const useStyles = makeStyles({
  source: {
    margin: 20,
  },
});

const LogsDataTable = (props) => {
  const classes = useStyles();

  const eventActorEmail = (item) => {
    if (!item?.actor?.type) return "-";
    if (item.actor.type === "USER") {
      return item.actor.account.username;
    }
    return "";
  };

  const eventActorGroups = (item) => {
    const sourceGroups = item?.actor?.groups;
    if (!sourceGroups) return "-";

    if (typeof sourceGroups === "string") {
      return JSON.parse(sourceGroups).map((g) => <div>{g}</div>);
    }
    if (typeof sourceGroups === "object") {
      if (sourceGroups.length === 0) return "-";
      let groups = sourceGroups.map((g) => <div>{g}</div>);
      if (sourceGroups.length > 3) {
        groups = groups.slice(0, 3);
        groups.push(<div>...</div>);
      }
      return groups;
    }
    return "-";
  };

  const getProjectName = (item) => {
    if (!item.project_id) return "N/A";
    const project = props.projects.find((x) => x.id === item.project_id);
    return project?.name || "N/A";
  };

  const parseRowData = (data) =>
    [
      {
        type: "regular",
        value: <DateFormat date={data._source.json.timestamp} />,
        stringValue: data._source.json.timestamp,
      },
      {
        type: "regular",
        value: eventActorEmail(data._source.json),
      },
      {
        type: "regular",
        value: getProjectName(data._source.json),
      },
      {
        type: "regular",
        value: eventActorGroups(data._source.json),
      },
      props.isRelayCommands && {
        type: "regular",
        value: data._source.json.detail.meta?.cluster_name,
      },
      {
        type: "regular",
        value: data._source.json.client.type,
      },
      {
        type: "regular",
        value: data._source.json.type,
      },
      {
        type: "regular",
        value: data._source.json.detail.message,
      },
      {
        type: "regular",
        value: data._source.json.client.user_agent,
      },
    ].filter(Boolean);

  const columnLabels = [
    { label: "" },
    { label: "Date" },
    { label: "User" },
    { label: "Project" },
    { label: "Groups", style: { minWidth: "170px" } },
    props.isRelayCommands && { label: "Cluster" },
    { label: "Client" },
    { label: "Type" },
    { label: "Message" },
    { label: "Agent" },
  ].filter(Boolean);

  const parseExpandedRow = (data) => {
    return (
      <div className={classes.source}>
        <ReactJson name="source" src={data._source.json} />
      </div>
    );
  };

  return (
    <Paper>
      <TableToolbar
        handleRefreshClick={props.handleRefreshClick}
        handleResetFilter={props.handleResetFilter}
        handleFilter={props.handleFilter}
        isProjectRole={props.isProjectRole}
        users={props.users}
        types={props.types}
        kinds={props.kinds}
        projects={props.projects}
        filter={props.filter}
        list={props?.list || []}
        handleRemoveFilter={props?.handleRemoveFilter}
      />
      <DataTable
        list={props?.list || []}
        count={props?.count}
        getCollapsedRow={parseExpandedRow}
        columnLabels={columnLabels}
        parseRowData={parseRowData}
        loading={props?.loading}
      />
    </Paper>
  );
};

export default LogsDataTable;

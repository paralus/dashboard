import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import ReactJson from "react-json-view";
import DateFormat from "components/DateFormat";
import DataTable from "components/TableComponents/DataTable";
import TableToolbar from "./TableToolbar";

const useStyles = makeStyles({
  source: {
    margin: 20,
  },
  link: { color: "teal", cursor: "pointer" },
});

const LogsDataTable = (props) => {
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState({});
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
    if (!item.project || item.project == "") return "N/A";
    return item.project;
  };

  const parseRowData = (data) =>
    [
      {
        type: "regular",
        value: <DateFormat timestamp={data._source.json.timestamp} />,
        stringValue: data._source.json.timestamp,
      },
      {
        type: "regular",
        value: (
          <div
            className={classes.link}
            onClick={(_) => {
              setOpen(true);
              setRowData(data);
            }}
          >
            <span>{eventActorEmail(data._source.json)}</span>
          </div>
        ),
      },
      {
        type: "regular",
        value: getProjectName(data._source.json),
      },
      props.isRelayCommands && {
        type: "regular",
        value: data._source.json.detail.meta?.cluster_name,
      },
      {
        type: "regular",
        value: data._source.json.detail.message,
      },
    ].filter(Boolean);

  const columnLabels = [
    { label: "" },
    { label: "Date" },
    { label: "User" },
    { label: "Project" },
    props.isRelayCommands && { label: "Cluster" },
    { label: "Message" },
  ].filter(Boolean);

  const parseExpandedRow = (data) => {
    return (
      <div className={classes.source}>
        <ReactJson name="source" src={data._source.json} />
      </div>
    );
  };

  return (
    <div>
      <Paper>
        <TableToolbar
          handleRefreshClick={props.handleRefreshClick}
          handleResetFilter={props.handleResetFilter}
          handleFilter={props.handleFilter}
          numSelected={0} // REQUIRED PROP
          isProjectAdmin={props.isProjectAdmin}
          isProjectRole={props.isProjectRole}
          users={Array.isArray(props.users) ? props.users : []}
          types={Array.isArray(props.types) ? props.types : []}
          kinds={Array.isArray(props.kinds) ? props.kinds : []}
          projects={Array.isArray(props.projects) ? props.projects : []}
          clusters={Array.isArray(props.clusters) ? props.clusters : []}
          filter={props.filter || {}}
          list={props.list || []}
          handleRemoveFilter={props.handleRemoveFilter || (() => {})}
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
      <Dialog
        open={open}
        onClose={(_) => {
          setOpen(false);
          setRowData({});
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Groups</DialogTitle>
        <DialogContent>
          <div>
            <div
              style={{
                border: "1px solid #00000024",
                padding: "10px",
                backgroundColor: "whitesmoke",
                borderRadius: "5px",
                minWidth: "500px",
              }}
            >
              {eventActorGroups(rowData?._source?.json)}
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ marginLeft: "65%" }}>
          <Button onClick={(_) => setOpen(false)} color="default">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LogsDataTable;

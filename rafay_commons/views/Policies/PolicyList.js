import React from "react";
import * as R from "ramda";
import moment from "moment";
import { Chip, makeStyles, IconButton, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import StarsIcon from "@material-ui/icons/Stars";
import VisibilityIcon from "@material-ui/icons/Visibility";

import DataGrid from "../../components/DataGrid";
import NewResourceButton from "../../components/NewResourceButton";

const useStyles = makeStyles(theme => ({
  chip: {
    borderRadius: 2,
    userSelect: "none",
    marginLeft: theme.spacing(1)
  },
  search: {
    width: 350
  },
  iconBtn: {
    padding: 8,
    marginRight: theme.spacing(1)
  }
}));

export default function PolicyList({
  loading,
  data,
  history,
  setDefault,
  openCreateDialog,
  openDeleteDialog,
  disableManagement
}) {
  const classes = useStyles();
  const oneOfDefault = R.anyPass([
    R.equals("rafay-privileged-psp"),
    R.equals("rafay-restricted-psp")
  ]);

  return (
    <DataGrid
      showSearchOnLeft
      data={data}
      loading={loading}
      classes={{ search: classes.search, tableRow: classes.tableRow }}
      actions={
        <NewResourceButton
          label="New PSP"
          onClick={openCreateDialog}
          disabled={disableManagement}
        />
      }
      columns={[
        {
          label: "Name",
          dataKey: "name",
          dataGetter: R.path(["rowData", "metadata", "name"]),
          render({ rowData, cellData: name }) {
            const isDefault = R.pathEq(
              ["metadata", "labels", "rafay.dev/default"],
              "true",
              rowData
            );
            return (
              <React.Fragment>
                {name}{" "}
                {isDefault && (
                  <Chip
                    label="Default"
                    variant="outlined"
                    size="small"
                    className={classes.chip}
                  />
                )}
              </React.Fragment>
            );
          }
        },
        {
          label: "Created At",
          dataKey: "createdAt",
          dataGetter: ({ rowData }) => {
            return rowData.metadata.createdAt;
          },
          render({ cellData: createdAt }) {
            return moment(createdAt).format("MM/DD/YYYY hh:mm:ss A");
          }
        },
        {
          label: "Modified At",
          dataKey: "modifiedAt",
          dataGetter: ({ rowData }) => {
            return rowData.metadata.modifiedAt || rowData.metadata.createdAt;
          },
          render({ cellData: modifiedAt }) {
            return moment(modifiedAt).format("MM/DD/YYYY hh:mm:ss A");
          }
        },
        {
          dataKey: "actions",
          sortable: false,
          align: "right",
          render({ rowData }) {
            const name = R.path(["metadata", "name"], rowData);
            const isDefault = R.pathEq(
              ["metadata", "labels", "rafay.dev/default"],
              "true",
              rowData
            );

            return (
              <React.Fragment>
                <Tooltip title="View">
                  <IconButton
                    aria-label="edit"
                    className={classes.iconBtn}
                    onClick={() => history.push(`/app/policies/view/${name}`)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Set as Default">
                  <IconButton
                    aria-label="default"
                    className={classes.iconBtn}
                    onClick={setDefault(name)}
                    disabled={isDefault || disableManagement}
                  >
                    <StarsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    aria-label="edit"
                    className={classes.iconBtn}
                    onClick={() => history.push(`/app/policies/edit/${name}`)}
                    disabled={oneOfDefault(name) || disableManagement}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="delete"
                    className={classes.iconBtn}
                    onClick={openDeleteDialog(name)}
                    disabled={
                      oneOfDefault(name) || disableManagement || isDefault
                    }
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            );
          }
        }
      ]}
    />
  );
}

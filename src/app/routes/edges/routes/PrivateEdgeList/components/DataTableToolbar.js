import React from "react";
import {
  Button,
  IconButton,
  Paper,
  Toolbar,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import chroma from "chroma-js";
import SearchBoxV2 from "components/SearchBoxV2";
import DownloadKubeconfig from "../../../../tools/details/components/DownloadKubeconfig";

const useStyles = makeStyles((theme) => ({
  refreshButton: {
    color: "teal",
    position: "absolute",
    marginTop: "-18px",
    marginLeft: "-15px",
  },
  bgGrey: {
    backgroundColor: "lightgrey",
  },
}));

const formatGroupLabel = (data) => {
  const styles = {
    groupStyles: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    groupBadgeStyles: {
      backgroundColor: "#EBECF0",
      borderRadius: "2em",
      color: "#172B4D",
      display: "inline-block",
      fontSize: 12,
      fontWeight: "normal",
      lineHeight: "1",
      minWidth: 1,
      padding: "0.3em 0.5em",
      textAlign: "center",
    },
  };
  return (
    <div style={styles.groupStyles}>
      <span>{data.label}</span>
      <span style={styles.groupBadgeStyles}>{data.options.length}</span>
    </div>
  );
};

const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: "white",
      // ? null
      // : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
      color: isDisabled
        ? "#ccc"
        : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.color,
      cursor: isDisabled ? "not-allowed" : "default",
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white",
    },
  }),
};

export const colourOptions = [
  {
    label: "READY",
    value: "READY",
    color: "teal",
  },
  {
    label: "NOT_READY",
    value: "NOT_READY",
    color: "purple",
  },
  {
    label: "PROVISIONING",
    value: "PROVISIONING",
    color: "blue",
  },
  {
    label: "UPGRADING",
    value: "UPGRADING",
    color: "gray",
  },
  {
    label: "PROVISION_FAILED",
    value: "PROVISION_FAILED",
    color: "red",
  },
  {
    label: "PRETEST_FAILED",
    value: "PRETEST_FAILED",
    color: "red",
  },
];

export const healthOptions = [
  {
    label: "HEALTHY",
    value: 1,
    color: "teal",
  },
  {
    label: "UNHEALTHY",
    value: 2,
    color: "red",
  },
  {
    label: "UNKNOWN",
    value: 3,
    color: "orange",
  },
];

export const groupedOptions = [
  {
    label: "Control Plane",
    options: healthOptions,
  },
  {
    label: "Operational Status",
    options: colourOptions,
  },
];

const DataTableToolbar = (props) => {
  const {
    handleCreateClick,
    searchValue,
    handleSearchChange,
    callGetEdges,
    userAndRoleDetail,
    data,
    hasWriteAccessInCluster,
  } = props;
  const isClusterListAvailable = data.length !== 0;
  const classes = useStyles();
  return (
    <Toolbar className="d-flex flex-column p-0">
      <div className="d-flex w-100 pt-3">
        <div className="ml-auto">
          <div className="actions d-inline-block">
            <div className="mr-4 d-inline-block">
              <div className="d-flex">
                <Tooltip title="Refresh">
                  <IconButton
                    className={`size-30 p-0 ${classes.refreshButton}`}
                    onClick={callGetEdges}
                  >
                    <i className="zmdi zmdi-refresh" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            {isClusterListAvailable && (
              <Paper className="mr-4 d-inline-block">
                {!props.renderInTable && (
                  <div className="d-flex">
                    <div className={classes.bgGrey}>
                      <IconButton className="size-30 p-0">
                        <i className="zmdi zmdi-view-stream" />
                      </IconButton>
                    </div>
                    <div>
                      <IconButton
                        className="size-30 p-0"
                        onClick={props.flipViewType}
                      >
                        <i className="zmdi zmdi-view-list-alt text-teal" />
                      </IconButton>
                    </div>
                  </div>
                )}
                {props.renderInTable && (
                  <div className="d-flex">
                    <div>
                      <IconButton
                        className="size-30 p-0"
                        onClick={props.flipViewType}
                      >
                        <i className="zmdi zmdi-view-stream text-teal" />
                      </IconButton>
                    </div>
                    <div className={classes.bgGrey}>
                      <IconButton className="size-30 p-0">
                        <i className="zmdi zmdi-view-list-alt" />
                      </IconButton>
                    </div>
                  </div>
                )}
              </Paper>
            )}
            <div className="d-inline-block">
              <DownloadKubeconfig user={userAndRoleDetail} withIcon />
              {hasWriteAccessInCluster && (
                <Button
                  variant="contained"
                  className="jr-btn jr-btn-label left text-nowrap text-white mr-3"
                  onClick={(event) => handleCreateClick(event)}
                  color="primary"
                >
                  <i className="zmdi zmdi-plus zmdi-hc-fw " />
                  <span>New Cluster</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex w-100 p-3">
        <div className="search-wrapper w-25">
          <SearchBoxV2
            placeholder="Search Clusters"
            onChange={handleSearchChange}
            value={searchValue}
          />
        </div>
      </div>
    </Toolbar>
  );
};

export default DataTableToolbar;

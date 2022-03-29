import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { STATUS_INDICATOR_LABEL } from "../constants/Constant";

const useStyles = makeStyles((theme) => ({
  indicator: {
    padding: "0.25rem",
    fontWeight: 500,
    fontSize: "0.6rem",
    width: "4rem",
    textAlign: "center",
    margin: "0.25rem 0",
  },
  active: {
    backgroundColor: "#C8F4E1",
    color: "#66A280",
    display: "none",
  },
  inactive: {
    backgroundColor: "#FEF0EF",
    color: "#DF5150",
  },
}));

const StatusIndicator = ({ status, props }) => {
  const classes = useStyles();
  return (
    <div
      className={`${classes.indicator} ${
        status ? classes.active : classes.inactive
      }`}
    >
      <span>{STATUS_INDICATOR_LABEL[status]}</span>
    </div>
  );
};

export default StatusIndicator;

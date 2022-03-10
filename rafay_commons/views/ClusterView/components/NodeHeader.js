import React from "react";
import * as R from "ramda";
import {
  Paper,
  Box,
  Typography,
  makeStyles,
  Grid,
  FormControlLabel,
  Switch
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 8,
    display: "flex",
    "& > div": {
      flex: 1
    }
  }
}));

function getStatus({ status }) {
  const getStatusColor = R.cond([
    [R.equals("READY"), R.always("primary")],
    [R.test(/(NOT|FAIL)/), R.always("error")],
    [R.T, R.always("textSecondary")]
  ]);
  return (
    <Typography display="inline" color={getStatusColor(status)}>
      {status || "NOT_READY"}
    </Typography>
  );
}

export default function NodeHeader({ node }) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Box p={2}>
        <Typography color="primary" paragraph variant="h6">
          {node.name}
        </Typography>
        <Box display="flex" alignItems="center" height="20px" lineHeight="20px">
          <Typography display="inline">Status: {getStatus(node)}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

import React from "react";
import * as R from "ramda";
import { Paper, Box, Typography, makeStyles } from "@material-ui/core";

import { colorCodePhases } from "utils";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    display: "flex",
    "& > div": {
      flex: 1
    }
  }
}));

export default function PodHeader({ resource, title }) {
  const classes = useStyles();
  const { containerReasons, phase } = resource; // resource = pod || container
  const { containerStatus } = resource;
  const status = containerStatus
    ? [containerStatus]
    : containerReasons
    ? R.values(containerReasons)
    : [phase];

  return (
    <Paper className={classes.root}>
      <Box p={2}>
        <Typography paragraph variant="h5">
          {title}
        </Typography>
        <Box display="flex" alignItems="center" height="20px" lineHeight="20px">
          <Typography display="inline">
            Status: {colorCodePhases(status)}
            {/* {colorCodePhases(
              containerReasons ? R.values(containerReasons) : [phase]
            )} */}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

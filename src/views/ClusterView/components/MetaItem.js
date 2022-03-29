import React from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";

import { isNothing, isSomething } from "utils";

const useStyles = makeStyles((theme) => ({
  item: {
    padding: 0,
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
  },
}));

export default function MetaItem({
  label,
  value,
  pre = false,
  alignItems,
  fallback = "NA",
}) {
  const classes = useStyles();
  const defaulted = value && isSomething(value) ? value : fallback;
  alignItems = alignItems || "center";

  return (
    <Grid item container alignItems={alignItems} className={classes.item}>
      <Grid item xs={2}>
        <Typography variant="body2" color="textSecondary" component="div">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={10}>
        {React.isValidElement(value) ? (
          value
        ) : (
          <Typography variant="body2" component="div">
            {pre ? <pre style={{ margin: 0 }}>{defaulted}</pre> : defaulted}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

import React from "react";
import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    paddingBottom: theme.spacing(2),
    "&:last-child": {
      paddingBottom: theme.spacing(2)
    }
  },
  title: {
    marginBottom: "0.8em",
    fontWeight: 500,
    fontSize: 14
  }
}));

export default function FieldCard({ title, children, disabled }) {
  const classes = useStyles();
  const textColor = disabled ? "textSecondary" : "textPrimary";

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Typography className={classes.title} color={textColor}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

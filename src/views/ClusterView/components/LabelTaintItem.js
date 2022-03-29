import React from "react";
import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  label: {
    color: "#FFFFFF",
    "& > :first-child": {
      padding: "4px 8px",
      backgroundColor: "#808080",
      borderRadius: "4px 0 0 4px",
    },
    "& > :nth-child(2)": {
      padding: "4px 8px",
      backgroundColor: "#D28FAC",
    },
    "& > :nth-child(3)": {
      padding: "4px 8px",
      backgroundColor: "#88B5C9",
    },
    "& > :last-child": {
      borderRadius: "0 4px 4px 0",
    },
  },
}));
export default function LabelItem({ item = {} }) {
  const classes = useStyles();
  const { key, value = null, effect = null } = item;
  return (
    <Box component="span" className={classes.label}>
      <Box component="span">{key}</Box>
      <Box component="span">{value}</Box>
      {effect && <Box component="span">{effect}</Box>}
    </Box>
  );
}

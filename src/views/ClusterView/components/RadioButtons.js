import React from "react";
import clsx from "clsx";
import { ButtonGroup, Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: "none",
  },
  boldText: {
    fontWeight: "700",
  },
}));

export default function RadioButtons({ value, options = [], onClick }) {
  const classes = useStyles();
  if (!options.length) return null;
  return (
    <ButtonGroup disableRipple disableFocusRipple>
      {options.map((option) => (
        <Button
          disableRipple
          disableElevation
          disableFocusRipple
          key={option.value}
          className={clsx(classes.button, {
            [classes.boldText]: value === option.value,
          })}
          onClick={(e) => onClick && onClick(e, option.value)}
        >
          {option.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}

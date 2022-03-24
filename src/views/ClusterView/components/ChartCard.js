import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  makeStyles,
} from "@material-ui/core";

import Spinner from "components/Spinner/Spinner";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 500,
  },
  cardHeader: {
    padding: theme.spacing(1.5, 2, 1, 2),
  },
  cardContent: {
    height: "calc(100% - 40px)",
    padding: theme.spacing(0, 1),
    "&:last-child": {
      padding: theme.spacing(0, 1),
    },
  },
  cardContentWithActions: {
    height: "calc(100% - 72px)",
    padding: theme.spacing(0, 1),
    "&:last-child": {
      padding: theme.spacing(0, 1),
    },
  },
  cardActions: {
    padding: theme.spacing(0, 2, 1, 2),
    overflowX: "auto",
  },
  chip: {
    borderRadius: 2,
  },
  actionableChip: {
    borderRadius: 2,
    height: 24,
    padding: "1px 8px",
    textTransform: "none",
    letterSpacing: "normal",
  },
  dumbChipRoot: {
    backgroundColor: "transparent",
    marginLeft: "0px !important",
    "&:not(:last-child)": {
      "&::after": {
        content: '"●"',
        margin: theme.spacing(0, 1),
      },
    },
  },
  dumbChipLabel: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const getChip = (classes) => (chip, idx) => {
  if (chip.onClick) {
    return (
      <Button
        disableElevation
        size="small"
        color="primary"
        variant="contained"
        className={classes.actionableChip}
        onClick={chip.onClick}
      >
        {chip.label}
      </Button>
    );
  }

  return (
    <Chip
      size="small"
      key={idx}
      className={classes.chip}
      label={chip.label}
      classes={{
        root: classes.dumbChipRoot,
        labelSmall: classes.dumbChipLabel,
      }}
    />
  );
};

export default function ChartCard({ loading, title, children, chips, action }) {
  const classes = useStyles();

  return (
    <Spinner loading={loading}>
      <Card className={classes.card} variant="outlined">
        <CardHeader
          title={title}
          classes={{
            title: classes.cardTitle,
            root: classes.cardHeader,
          }}
          action={action}
        />
        {chips && (
          <CardActions className={classes.cardActions}>
            {chips.map(getChip(classes))}
          </CardActions>
        )}
        <CardContent
          className={classes[chips ? "cardContentWithActions" : "cardContent"]}
        >
          {children}
        </CardContent>
      </Card>
    </Spinner>
  );
}

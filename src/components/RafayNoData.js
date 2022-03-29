import React from "react";
import { makeStyles } from "@material-ui/core";
import FindInPageIcon from "@material-ui/icons/FindInPage";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
  },
  iconContainer: {
    height: "5rem",
    width: "5rem",
    backgroundColor: "teal",
    backgroundImage: "linear-gradient(315deg, #0fefe1 0%, #06b397 74%)",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
  },
  icon: {
    height: "3rem",
    width: "3rem",
    color: "#FFFFFF",
    margin: "1rem auto",
  },
  label: {
    fontWeight: "500",
    color: "#1f3446",
    marginTop: "1rem",
  },
  description: {
    color: "#9ea6ac",
    fontWeight: "400",
  },
}));

const DEFAULT_LABEL = "No Data Available!";
const DEFAULT_LABEL_DESCRIPTION =
  "Currently we don't have any results to display.";

const RafayPlaceholder = ({
  label = DEFAULT_LABEL,
  description = DEFAULT_LABEL_DESCRIPTION,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.iconContainer}>
        <FindInPageIcon className={classes.icon} />
      </div>
      <h3 className={classes.label}>{label}</h3>
      <h6 className={classes.description}>{description}</h6>
    </div>
  );
};

export default RafayPlaceholder;

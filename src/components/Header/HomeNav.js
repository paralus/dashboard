import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import HomeIcon from "@material-ui/icons/Home";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BuildIcon from "@material-ui/icons/Build";
import HelpIcon from "@material-ui/icons/Help";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
  button: {
    "&:hover": {
      color: "teal",
      backgroundColor: "#00000008",
    },
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  buttonSelected: {
    // "&:hover": {
    //   color: "black",
    //   backgroundColor: "#00000000"
    // },
    fontWeight: "500",
    color: "teal !important",
    borderBottom: "3px solid teal",
    borderRadius: "0px",
    marginBottom: "-3px",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  side: {
    borderRight: "2px solid black",
    marginLeft: "25px",
    paddingRight: "10px",
  },
}));

const HomeNav = () => {
  const classes = useStyles();
  return (
    <div className={classes.side}>
      <Button
        // size="small"
        className={classes.button}
        href="/#/main"
        startIcon={<HomeIcon />}
      >
        Home
      </Button>
    </div>
  );
};

export default HomeNav;

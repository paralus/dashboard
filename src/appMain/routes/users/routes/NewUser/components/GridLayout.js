/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  list: {
    marginBottom: "20px",
    // width: 400,
    // minHeight: 230,
    // maxHeight: 500,
    // backgroundColor: theme.palette.background.paper,
    // overflow: "auto"
  },
  titleCard: {
    display: "flex",
    padding: "10px",
    alignItems: "center",
    marginBottom: "10px",
    // backgroundColor: "dodgerblue",
    backgroundColor: "lightgray",
    // color: "white"
  },
}));

const config = {
  links: [
    {
      label: `Users`,
      href: "#/main/users",
    },
    {
      label: `New User`,
      current: true,
    },
  ],
};

const GridLayout = ({ leftTitle, rightTitle, leftView, rightView }) => {
  const classes = useStyles();
  return (
    <div>
      <div className="m-4">
        <div className="mb-3">
          <ResourceBreadCrumb config={config} />
        </div>
        <div>
          {/* <div className={classes.list}>{leftView}</div>
          <div className={classes.list}>{rightView}</div> */}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="stretch"
            className={classes.root}
          >
            <Grid item>
              <div className={classes.list}>{leftView}</div>
              <div className={classes.list}>{rightView}</div>
            </Grid>
            {/* <Grid item>
            </Grid> */}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default GridLayout;

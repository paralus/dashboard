import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Paper, Container, Typography, Button } from "@material-ui/core";
import BackgroundImage from "./BackgroundImage";

const useStyles = makeStyles({
  root: {
    maxWidth: "800px",
  },
  heading: {
    height: "70px",
    padding: "20px",
    backgroundColor: "#def3f1",
    position: "relative",
    // BackgroundImage: `url(${BackgroundImage})`
  },
  container: {
    paddingBottom: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  title: {
    marginLeft: "8px",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  linkHelper: {
    fontSize: 14,
    marginTop: "60px",
    marginLeft: "8px",
  },
  link: {
    fontSize: 24,
    fontWeight: 500,
    color: "teal",
  },
});

const RafayInfoCard = ({ title, linkHelper, link }) => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Paper>
        <div className={classes.heading}>
          <BackgroundImage />
          <Typography variant="h5" component="h2" className={classes.title}>
            {title}
          </Typography>
        </div>
        <div className={classes.container}>
          <div className={classes.linkHelper}>{linkHelper}</div>
          {link}
        </div>
      </Paper>
    </Container>
  );
};

export default RafayInfoCard;

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: 275,
  },
  title: {
    fontSize: 14,
  },
  count: {
    marginBottom: 12,
  },
});

const NavCard = ({ title, count, href }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography variant="h3" className={classes.count}>
          {count}
        </Typography>
      </CardContent>
      <CardActions>
        <a href={href} className="text-teal">
          <span>
            <i className="zmdi zmdi-view-list zmdi-hc-fw" />
          </span>
          <span>View List</span>
        </a>
      </CardActions>
    </Card>
  );
};

export default NavCard;

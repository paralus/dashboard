import React from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

const handleClick = (event, callback) => {
  event.preventDefault();
  callback();
};

const ActiveLink = ({ link, index }) => {
  const classes = useStyles();
  return (
    <Link key={index} className={classes.root} href={link.href}>
      {link.label}
    </Link>
  );
};

const InactiveLink = ({ link, index }) => {
  return (
    <Typography key={index} style={{ color: "text-muted" }}>
      {link.label}
    </Typography>
  );
};

const CallbackLink = ({ link, index }) => {
  const classes = useStyles();
  return (
    <Link
      key={index}
      className={classes.root}
      href=""
      onClick={(e) => handleClick(e, link.callback)}
    >
      {link.label}
    </Link>
  );
};

const ResourceBreadCrumb = ({ config }) => {
  // const classes = useStyles();
  return (
    // <Box my={1.5}>
    <Box my={0}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {config.links &&
          config.links.map((link, index) => {
            if (link.current) {
              return <InactiveLink link={link} index={index} key={index} />;
            }
            if (link.callback) {
              return <CallbackLink link={link} index={index} key={index} />;
            }
            return <ActiveLink link={link} index={index} key={index} />;
          })}
      </Breadcrumbs>
    </Box>
  );
};

export default ResourceBreadCrumb;

// const config = {
//   links: [
//     {
//       label: "Clusters",
//       href: "#/app/clusters"
//     },
//     {
//       label: "callback",
//       callback: props => {
//         console.log("callback called");
//       }
//     },
//     {
//       label: "aa",
//       current: true
//     }
//   ]
// };

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Menu, MenuItem, Paper } from "@material-ui/core";
import useLocalStorage from "utils/useLocalStorage";
import {
  withRouter,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: "30px",
    border: "1px solid #08B09C",
    fontSize: "15px",
    fontWeight: 500,
  },
  scope: {
    padding: "7px 10px",
  },
  project: {
    padding: "7px 10px",
    backgroundColor: "#989e9e4a",
  },
  p0: {
    padding: "0px",
  },
  menuList: {
    whiteSpace: "unset",
    wordBreak: "break-all",
    maxWidth: "20rem",
  },
}));

const ProjectSelector = ({
  options,
  currentProject,
  changeProject,
  isSystemContext,
  isProjectRole,
  match,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [minWidth, setMinWidth] = useState(0);
  const [cachedProject, setCachedProject] = useLocalStorage("currentProject");

  const history = useHistory();
  const location = useLocation();
  // When in Kubectl Console fullscreen and project has been changed in another tab, redirect to login page
  if (
    match.path === "/console/:projectId/:clusterName" &&
    match.params.projectId !== cachedProject
  ) {
    return <Redirect to="/login" />;
  }

  useEffect(() => {
    // Load project from cache
    if (!cachedProject) {
      setCachedProject(currentProject.metadata.name);
      return;
    }
    // When cached project is not equal to current project, set project to cachedProject if found in the project list
    // If not found, set current project as cached project as this might be and overflow from a different user
    if (currentProject.metadata.name !== cachedProject) {
      const found = options.find((p) => p.metadata.name === cachedProject);
      if (found) {
        changeProject(cachedProject);
      } else {
        setCachedProject(currentProject.metadata.name);
      }
    }
  });

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
    setMinWidth(event.currentTarget.offsetWidth);
  };

  const handleMenuItemClick = (event, project) => {
    const subStrs = location.pathname.split("/");
    if (subStrs.length > 3) {
      if (subStrs[2] === "databackup") {
        history.replace(`/app/databackup/${subStrs[3]}`);
      } else {
        history.replace(`/app/${subStrs[2]}`);
      }
    }
    setCachedProject(project);
    changeProject(project);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getSortedData = (data) => {
    if (!data) return [];
    return data.sort((a, b) => {
      return a.metadata.name.localeCompare(b.metadata.name, undefined, {
        sensitivity: "base",
      });
    });
  };

  if (isSystemContext && !isProjectRole) {
    return (
      <Paper className={classes.root}>
        <List component={Paper} className={classes.p0}>
          <ListItem className={classes.p0}>
            <div className={classes.scope}>
              <span>
                <span className="text-muted">SCOPE:</span>
                <span>&nbsp;ORGANIZATION</span>
              </span>
            </div>
          </ListItem>
        </List>
      </Paper>
    );
  }

  return (
    <Paper className={classes.root}>
      <List component={Paper} className={classes.p0}>
        <ListItem
          button
          disabled={
            options.length <= 1 ||
            match.path === "/console/:projectId/:clusterName"
          }
          onClick={handleClickListItem}
          className={classes.p0}
        >
          <div className="d-flex flex-row">
            <div className={classes.scope}>
              <span>
                <span className="text-muted">SCOPE:</span>
                <span>&nbsp;PROJECT</span>
              </span>
            </div>
            <div className={classes.project}>
              <span>{`${currentProject.metadata.name}`}</span>
              <i className="zmdi zmdi-caret-down zmdi-hc-lg ml-2" />
            </div>
          </div>
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menuList}
      >
        <MenuItem key="-1" disabled style={{ minWidth }}>
          <span>Switch Project Scope to:</span>
        </MenuItem>
        {getSortedData(options).map((option, index) => (
          <MenuItem
            className={classes.menuList}
            key={option.metadata.id}
            disabled={option.metadata.name === currentProject.metadata.name}
            selected={option.metadata.name === currentProject.metadata.name}
            onClick={(event) =>
              handleMenuItemClick(event, option.metadata.name)
            }
          >
            {option.metadata.name}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default withRouter(ProjectSelector);

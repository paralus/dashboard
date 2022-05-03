import React, { useState } from "react";
import { Paper, Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import IconButton from "@material-ui/core/IconButton";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import PeopleIcon from "@material-ui/icons/People";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import useLocalStorage from "utils/useLocalStorage";
import Tooltip from "@material-ui/core/Tooltip";
import RafayConfirmIconAction from "components/RafayConfirmIconAction";
import { changeProject, deleteProject } from "actions/index";
import RafaySnackbar from "components/RafaySnackbar";

const useStyles = makeStyles((theme) => ({
  title: {
    "&:hover": {
      color: "#009688",
    },
    cursor: "pointer",
    padding: "15px",
    marginBottom: "0px",
    paddingBottom: "10px",
    maxWidth: "18rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  card: {
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  created: {
    fontSize: "11px",
    paddingLeft: "15px",
  },
}));

const ProjectCard = ({ data, refreshProjects }) => {
  const classes = useStyles();
  const [cachedProject, setCachedProject] = useLocalStorage("currentProject");
  const [alert, setAlert] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { permissions, isAdmin } = useSelector((state) => {
    return {
      permissions: state.UserSession?.projectRoles[data.id],
      isAdmin: state.UserSession.visibleAdmin,
    };
  });
  const organization = useSelector(
    (state) => state.settings.organization.detail
  );

  const handleProjectClick = (project, path) => {
    setCachedProject(project);
    dispatch(changeProject(project, true));
    let defaultPath = "/app/edges";
    const navpath = path ? `/app/${path}` : defaultPath;
    history.push(navpath);
  };

  const handleActionClick = (project) => {
    history.push(`/main/projects/${data.metadata.name}`);
  };

  const deleteSuccessCallback = (_) => {
    refreshProjects();
    setAlert({
      show: true,
      message: "Project Delete Sucessful",
      severity: "success",
    });
  };

  const deleteErrorCallback = (message) => {
    setAlert({
      show: true,
      message,
      severity: "error",
    });
  };

  const handleDeleteProject = (_) => {
    dispatch(
      deleteProject(
        data.metadata.name,
        deleteSuccessCallback,
        deleteErrorCallback
      )
    );
  };

  return (
    <div className="p-3 col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
      <Paper className="p-0">
        <div className="d-flex justify-content-between w-100">
          <div className={classes.card}>
            <Tooltip
              title={data.metadata.name}
              placement="top-start"
              arrow
              followcursor="true"
              open={tooltipOpen}
            >
              <h2
                className={classes.title}
                onClick={(_) => handleProjectClick(data.metadata.name)}
                onMouseEnter={(e) => {
                  const { offsetWidth, scrollWidth } = e.target;
                  if (offsetWidth < scrollWidth) setTooltipOpen(true);
                }}
                onMouseLeave={(e) => {
                  const { offsetWidth, scrollWidth } = e.target;
                  if (offsetWidth < scrollWidth) setTooltipOpen(false);
                }}
              >
                {data.metadata.name}
              </h2>
            </Tooltip>
            <div className="p-3">
              {(isAdmin || permissions?.visibleInfra) && (
                <div>
                  <Button
                    color="primary"
                    size="small"
                    startIcon={<LocationCityIcon />}
                    onClick={(_) =>
                      handleProjectClick(data.metadata.name, "edges")
                    }
                  >
                    Clusters
                  </Button>
                </div>
              )}
              <div className="mt-2">
                <Button
                  color="primary"
                  size="small"
                  variant="outlined"
                  endIcon={<TrendingFlatIcon />}
                  onClick={(_) => handleProjectClick(data.metadata.name)}
                >
                  Go to project
                </Button>
              </div>
            </div>
          </div>
          <div className="p-1 d-flex flex-column">
            {isAdmin && (
              <>
                <Tooltip title="Settings">
                  <IconButton
                    key="settings"
                    aria-label="Settings"
                    // color="inherit"
                    onClick={(_) => handleActionClick(data.metadata.name)}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Manage Membership">
                  <IconButton
                    key="membership"
                    aria-label="Edit"
                    // color="inherit"
                    onClick={(_) => handleActionClick(data.metadata.name)}
                  >
                    <PeopleIcon />
                  </IconButton>
                </Tooltip>
                <RafayConfirmIconAction
                  icon={<DeleteIcon />}
                  action={handleDeleteProject}
                  disabled={data.spec.default}
                  confirmText={
                    <>
                      <span className="mr-1">
                        Are you sure you want to delete project
                        <b> {data.metadata.name}</b> ?
                      </span>
                    </>
                  }
                  tooltip="Delete Project"
                />
              </>
            )}
          </div>
        </div>
      </Paper>
      <RafaySnackbar
        open={alert.show}
        severity={alert.severity}
        message={alert.message}
        closeCallback={(_) => setAlert({ show: false })}
      />
    </div>
  );
};

export default ProjectCard;

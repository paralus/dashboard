/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import T from "i18n-react";
import ProjectCard from "./components/ProjectCard";
import RolesCard from "./components/RolesCard";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  titleCard: {
    display: "flex",
    padding: "10px",
    alignItems: "center",
    marginBottom: "10px",
    minHeight: "62px",
    // backgroundColor: "dodgerblue",
    backgroundColor: "lightgray",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const ProjectRoleWidget = ({
  systemRoles,
  projectsList,
  onProjectChange,
  handleRolesChange,
  editRoles,
  editProject,
}) => {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [selectedProject, setSelectedProject] = React.useState("");
  const [projectRoleDisabled, setProjectRoleDisabled] = React.useState(false);
  const [roleModified, setRoleModified] = React.useState(false);

  React.useEffect(() => {
    if (editRoles && systemRoles && !roleModified) {
      const editChecked = editRoles
        .filter((r) => r.project === editProject)
        .map((ar) => {
          return systemRoles.find((r) => r.metadata.name === ar.role);
        });
      const uniqueRoles = [...new Set(editChecked)];
      setChecked(uniqueRoles);
      handleRolesChange(uniqueRoles);
    }
  }, [editRoles]);

  const handleToggle = (value) => () => {
    setRoleModified(true);
    const currentIndex = checked.findIndex(
      (element) => element.metadata.name === value.metadata.name
    );
    const newChecked = [...checked];

    if (currentIndex === -1) {
      if (value.metadata.name === "ADMIN") {
        setProjectRoleDisabled(true);
        setChecked([value]);
        handleRolesChange([value]);
        setSelectedProject("ALL PROJECTS");
        onProjectChange("ALL PROJECTS");
        return;
      }
      if (value.metadata.name === "PROJECT_ADMIN") {
        const proi = checked.findIndex(
          (element) => element.metadata.name === "PROJECT_READ_ONLY"
        );
        if (proi !== -1) {
          newChecked.splice(proi, 1);
        }
      }
      if (value.metadata.name === "PROJECT_READ_ONLY") {
        const pai = checked.findIndex(
          (element) => element.metadata.name === "PROJECT_ADMIN"
        );
        if (pai !== -1) {
          newChecked.splice(pai, 1);
        }
      }
      if (value.metadata.name === "INFRA_ADMIN") {
        const proi = checked.findIndex(
          (element) => element.metadata.name === "INFRA_READ_ONLY"
        );
        if (proi !== -1) {
          newChecked.splice(proi, 1);
        }
      }
      if (value.metadata.name === "INFRA_READ_ONLY") {
        const pai = checked.findIndex(
          (element) => element.metadata.name === "INFRA_ADMIN"
        );
        if (pai !== -1) {
          newChecked.splice(pai, 1);
        }
      }
      newChecked.push(value);
    } else {
      if (value.metadata.name === "ADMIN") {
        setProjectRoleDisabled(false);
        setSelectedProject("");
        onProjectChange("");
      }
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    handleRolesChange(newChecked);
  };

  const handleProjectChange = (e) => {
    const proj = e.target.value;
    if (proj === "ALL PROJECTS") {
      setProjectRoleDisabled(true);
      const adminRole = systemRoles.find(
        (element) => element.metadata.name === "ADMIN"
      );
      if (adminRole) {
        setChecked([adminRole]);
        handleRolesChange([adminRole]);
      }
    } else {
      setProjectRoleDisabled(false);
      const ai = checked.findIndex(
        (element) => element.metadata.name === "ADMIN"
      );
      if (ai !== -1) {
        const newChecked = [...checked];
        newChecked.splice(ai, 1);
        setChecked(newChecked);
      }
    }
    setSelectedProject(proj);
    onProjectChange(proj);
  };

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="stretch"
      className={classes.root}
    >
      <Grid item>
        <Paper className={classes.titleCard}>
          <h2 className="h2 mb-0">
            <T.span text="users.edit_project.widget_labels.select_project" />
          </h2>
        </Paper>
        <ProjectCard
          selectedProject={editProject}
          projectsList={projectsList}
          handleProjectChange={handleProjectChange}
        />
      </Grid>
      <Grid item>
        <Paper className={classes.titleCard}>
          <h2 className="h2 mb-0">
            <T.span text="users.edit_project.widget_labels.select_roles" />
          </h2>
        </Paper>
        <RolesCard
          systemRoles={systemRoles}
          handleToggle={handleToggle}
          projectRoleDisabled={projectRoleDisabled}
          checked={checked}
          editRoles={editRoles}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectRoleWidget;

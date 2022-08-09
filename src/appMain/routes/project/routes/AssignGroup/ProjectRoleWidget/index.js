/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { useParams } from "react-router";
import GroupCard from "./components/GroupCard";
import NamespaceCard from "components/NamespaceCard";
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
  editNamespaces,
  systemRoles,
  groupsList,
  onNamespacesChange,
  onGroupChange,
  handleRolesChange,
  selectedProject,
}) => {
  const { projectId } = useParams();
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [selectedGroup, setSelectedGroup] = React.useState("");
  const [projectRoleDisabled, setProjectRoleDisabled] = React.useState(false);
  const [selectedNamespaces, setSelectedNamespaces] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      if (["ADMIN", "ADMIN_READ_ONLY"].includes(value.metadata.name)) {
        setProjectRoleDisabled(true);
        setChecked([value]);
        handleRolesChange([value]);
        setSelectedGroup("ALL PROJECTS");
        onGroupChange("ALL PROJECTS");
        return;
      }
      const pairs = ["PROJECT", "INFRA", "NAMESPACE"]
        .map((e) => [
          [e + "_ADMIN", e + "_READ_ONLY"],
          [e + "_READ_ONLY", e + "_ADMIN"],
        ])
        .reduce((a, b) => [...a, ...b], []);

      for (let pair of pairs) {
        if (value.metadata.name === pair[0]) {
          const item = checked.findIndex(
            (element) => element.metadata.name === pair[1]
          );
          if (item !== -1) newChecked.splice(item, 1);
        }
      }
      newChecked.push(value);
    } else {
      if (["ADMIN", "ADMIN_READ_ONLY"].includes(value.metadata.name)) {
        setProjectRoleDisabled(false);
        setSelectedGroup("");
        onGroupChange("");
      }
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    handleRolesChange(newChecked);
  };

  const handleGroupChange = (e) => {
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
    setSelectedGroup(proj);
    onGroupChange(proj);
  };

  const handleNamespacesChange = (event) => {
    setSelectedNamespaces([...event.target.value]);
    onNamespacesChange([...event.target.value]);
  };

  const namespaceChecked =
    checked.findIndex((x) => x.spec.scope === "namespace") !== -1;

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
          <h2 className="h2 mb-0">Select Group</h2>
        </Paper>
        <GroupCard
          selectedGroup={selectedGroup}
          groupsList={groupsList}
          handleGroupChange={handleGroupChange}
        />
        {namespaceChecked ? (
          <div className="mt-3">
            <Paper className={classes.titleCard}>
              <h2 className="h2 mb-0">
                {/* <T.span text="users.assign_to_project.widget_labels.select_project" /> */}
                <span>Select Namespace</span>
              </h2>
            </Paper>
            <NamespaceCard
              selectedProject={selectedProject}
              selectedNamespaces={selectedNamespaces}
              onNamespacesChange={handleNamespacesChange}
            />
          </div>
        ) : null}
      </Grid>
      <Grid item>
        <Paper className={classes.titleCard}>
          <h2 className="h2 mb-0">Select Roles</h2>
        </Paper>
        <RolesCard
          systemRoles={systemRoles}
          handleToggle={handleToggle}
          projectRoleDisabled={projectRoleDisabled}
          checked={checked}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectRoleWidget;

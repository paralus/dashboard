/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { useParams } from "react-router";
import UserCard from "./components/UserCard";
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
  usersList,
  onNamespacesChange,
  onUserChange,
  handleRolesChange,
}) => {
  const classes = useStyles();
  const { projectId } = useParams();
  const [checked, setChecked] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState("");
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
        setSelectedUser("ALL PROJECTS");
        onUserChange("ALL PROJECTS");
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
      if (value.metadata.name === "NAMESPACE_ADMIN") {
        const pai = checked.findIndex(
          (element) => element.metadata.name === "NAMESPACE_READ_ONLY"
        );
        if (pai !== -1) {
          newChecked.splice(pai, 1);
        }
      }
      if (value.metadata.name === "NAMESPACE_READ_ONLY") {
        const pai = checked.findIndex(
          (element) => element.metadata.name === "NAMESPACE_ADMIN"
        );
        if (pai !== -1) {
          newChecked.splice(pai, 1);
        }
      }
      newChecked.push(value);
    } else {
      if (["ADMIN", "ADMIN_READ_ONLY"].includes(value.metadata.name)) {
        setProjectRoleDisabled(false);
        setSelectedUser("");
        onUserChange("");
      }
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    handleRolesChange(newChecked);
  };

  const handleUserChange = (e) => {
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
    setSelectedUser(proj);
    onUserChange(proj);
  };

  const handleNamespacesChange = (event) => {
    setSelectedNamespaces([...event.target.value]);
    onNamespacesChange([...event.target.value]);
  };

  const namespaceChecked =
    checked.findIndex((x) => x.metadata.name.includes("NAMESPACE")) !== -1;

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
          <h2 className="h2 mb-0">Select User</h2>
        </Paper>
        <UserCard
          selectedUser={selectedUser}
          usersList={usersList}
          handleUserChange={handleUserChange}
        />
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

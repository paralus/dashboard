/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper } from "@material-ui/core";
import { useParams } from "react-router";
import UserCard from "./components/UserCard";
import RolesCard from "./components/RolesCard";
import NamespaceCard from "components/NamespaceCard";

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
  usersList,
  onNamespacesChange,
  onUserChange,
  handleRolesChange,
  editUser,
  editRoles,
}) => {
  const classes = useStyles();
  const { projectId } = useParams();
  const [checked, setChecked] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState("");
  const [projectRoleDisabled, setProjectRoleDisabled] = React.useState(false);
  const [roleModified, setRoleModified] = React.useState(false);
  const [currentNamespaces, setCurrentNamespaces] = React.useState([]);

  React.useEffect(() => {
    if (editRoles && systemRoles && !roleModified) {
      const editChecked = editRoles.map((ar) => {
        return systemRoles.find((r) => r.metadata.name === ar.role);
      });
      if (!checked.length && editRoles) {
        const uniqueRoles = [...new Set(editChecked)];
        setChecked(uniqueRoles);
        handleRolesChange(uniqueRoles);
      }
    }
  }, [editRoles]);

  React.useEffect(() => {
    // Handling namespaces here
    if (editRoles && editRoles.length > 0) {
      let tempCurrentNamespaces = [];
      editRoles.forEach((role) => {
        if (role.namespace && role.namespace !== undefined)
          tempCurrentNamespaces.push(role.namespace);
      });
      tempCurrentNamespaces = [...new Set(tempCurrentNamespaces)];
      setCurrentNamespaces(tempCurrentNamespaces);
      onNamespacesChange(tempCurrentNamespaces);
    }
  }, []);

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
      if (value.metadata.name === "ADMIN") {
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
    setCurrentNamespaces(event.target.value);
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
          <h2 className="h2 mb-0">Select User</h2>
        </Paper>
        <UserCard
          selectedUser={editUser}
          usersList={usersList}
          handleUserChange={handleUserChange}
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
              selectedProject={projectId}
              selectedNamespaces={currentNamespaces}
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

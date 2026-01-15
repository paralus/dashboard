import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, TextField, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  selectField: {
    // padding: "20px"
  },
  listItem: {
    padding: theme.spacing(1, 1),
  },
  leftCard: {
    minWidth: 300,
    minHeight: 230,
    maxHeight: 500,
    padding: "20px",
  },
}));

const ProjectCard = ({
  selectedProject,
  projectsList,
  handleProjectChange,
}) => {
  const classes = useStyles();

  let fieldValue = "";
  if (selectedProject === "ALL PROJECTS") {
    fieldValue = selectedProject;
  } else {
    fieldValue = projectsList.items.find(
      (p) => p.metadata.name === selectedProject
    );
  }

  return (
    <Card className={classes.leftCard} elevation={0} variant="outlined">
      <Grid
        container
        direction="column"
        justify="space-evenly"
        alignItems="stretch"
      >
        <Grid item>
          <div className={classes.selectField}>
            <TextField
              select
              margin="dense"
              id="project"
              name="project"
              required
              className="mt-0"
              disabled
              value={
                selectedProject === "ALL PROJECTS"
                  ? selectedProject
                  : selectedProject
              }
              label="Project"
              onChange={handleProjectChange}
              fullWidth
            >
              <MenuItem key="default" value="ALL PROJECTS">
                <span style={{ fontWeight: 500 }}>ALL PROJECTS</span>
              </MenuItem>
              {projectsList &&
                projectsList.items &&
                projectsList.items.length > 0 &&
                projectsList.items.map((option) => (
                  <MenuItem
                    key={option.metadata.name}
                    value={option.metadata.name}
                  >
                    {option.metadata.name}
                  </MenuItem>
                ))}
            </TextField>
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ProjectCard;

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Card, TextField, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  selectField: {
    maxWidth: "20rem",
    whiteSpace: "nowrap",
    overflow: "auto",
    textOverflow: "ellipsis",
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
  menuList: {
    whiteSpace: "unset",
    wordBreak: "break-all",
    maxWidth: "20rem",
  },
  boldText: {
    fontWeight: 500,
  },
}));

const ProjectCard = ({
  selectedProject,
  projectsList,
  handleProjectChange,
  hasProjectRole,
}) => {
  const classes = useStyles();
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
              className={classes.menuList}
              value={selectedProject}
              label="Project"
              onChange={handleProjectChange}
              fullWidth
            >
              {!hasProjectRole && (
                <MenuItem key="default" value="ALL PROJECTS">
                  <span className={classes.boldText}>ALL PROJECTS</span>
                </MenuItem>
              )}
              {projectsList?.items?.map((option) => (
                <MenuItem
                  key={option.id}
                  value={option}
                  className={classes.menuList}
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

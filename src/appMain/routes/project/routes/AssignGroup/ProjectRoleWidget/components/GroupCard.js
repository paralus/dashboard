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

const GroupCard = ({ selectedGroup, groupsList, handleGroupChange }) => {
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
              id="group"
              name="group"
              required
              className="mt-0"
              value={selectedGroup}
              label="Group"
              onChange={handleGroupChange}
              fullWidth
            >
              {/* <MenuItem key="default" value="ALL PROJECTS">
                <span style={{ fontWeight: 500 }}>ALL PROJECTS</span>
              </MenuItem> */}
              {groupsList &&
                groupsList.map((option) => (
                  <MenuItem
                    key={option.metadata.id}
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

export default GroupCard;

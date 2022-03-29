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

const UserCard = ({ selectedUser, usersList, handleUserChange }) => {
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
              id="user"
              name="user"
              required
              className="mt-0"
              value={selectedUser}
              label="User"
              onChange={handleUserChange}
              fullWidth
            >
              {/* <MenuItem key="default" value="ALL PROJECTS">
                <span style={{ fontWeight: 500 }}>ALL PROJECTS</span>
              </MenuItem> */}
              {usersList &&
                usersList.map((option) => (
                  <MenuItem key={option.metadata.id} value={option}>
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

export default UserCard;

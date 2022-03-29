import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from "@material-ui/core";
import { RoleTypes } from "constants/RoleTypes";
import RoleHelp from "./RoleHelp";

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 1),
  },
  list: {
    width: 600,
    minHeight: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const RolesCard = ({
  systemRoles,
  handleToggle,
  projectRoleDisabled,
  checked,
}) => {
  const classes = useStyles();
  const filterAdminRole = (role) => {
    return role.name !== "ADMIN";
  };

  return (
    <Card elevation={0} variant="outlined">
      <List className={classes.list} dense component="div" role="list">
        {systemRoles &&
          systemRoles.filter(filterAdminRole).map((value, index) => {
            const labelId = `transfer-list-all-item-${index}-label`;

            return (
              <ListItem
                key={index}
                role="listitem"
                button
                onClick={handleToggle(value)}
                className={classes.listItem}
                disabled={projectRoleDisabled && value.name === "ADMIN"}
              >
                <ListItemIcon>
                  <Checkbox
                    color="primary"
                    checked={
                      checked.findIndex(({ name }) => name === value.name) !==
                      -1
                    }
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                    disabled={projectRoleDisabled && value.name === "ADMIN"}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={
                    <span style={{ fontWeight: 500 }}>
                      {RoleTypes[value.name]}
                    </span>
                  }
                  secondary={RoleHelp[value.name]}
                />
              </ListItem>
            );
          })}
        <ListItem />
      </List>
    </Card>
  );
};

export default RolesCard;

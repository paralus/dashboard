import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { MenuItem, Button, Grid, Paper } from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import T from "i18n-react";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  root: {
    // margin: "auto"
  },
  listItem: {
    padding: theme.spacing(1, 1),
  },
  userform: {
    width: 600,
    // minHeight: 230,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    padding: "20px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  titleCard: {
    display: "flex",
    padding: "10px",
    alignItems: "center",
    marginBottom: "10px",
    // backgroundColor: "dodgerblue",
    backgroundColor: "lightgray",
    // color: "white"
  },
}));

const Profile = ({
  user,
  drawerType,
  handleAccountChange,
  onDiscardAndExit,
  onSaveProfile,
}) => {
  const classes = useStyles();
  return (
    <>
      {/* <Paper className={classes.titleCard}>
        <h2 className="h2 mb-0">Profile</h2>
      </Paper> */}
      <Paper className={classes.userform}>
        <h2 className="h2 mb-2">Profile</h2>
        <ValidatorForm
          noValidate
          autoComplete="off"
          // onSubmit={handleAdduser}
          onError={(errors) => console.log(errors)}
        >
          <div className="row">
            <div className="col-md-12">
              <TextValidator
                autoFocus
                required
                margin="dense"
                id="username"
                name="Email"
                value={user.metadata.name}
                label={"Email"}
                onChange={handleAccountChange("username")}
                fullWidth
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "email is not valid"]}
              />
            </div>

            {
              <>
                <div className="col-md-6">
                  <TextValidator
                    required
                    margin="dense"
                    id="first_name"
                    name="First Name"
                    value={user.spec.firstName}
                    label="First Name"
                    onChange={handleAccountChange("first_name")}
                    fullWidth
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </div>
                <div className="col-md-6">
                  <TextValidator
                    required
                    margin="dense"
                    id="last_name"
                    name="Last Name"
                    value={user.spec.lastName}
                    label="Last Name"
                    onChange={handleAccountChange("last_name")}
                    fullWidth
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                  />
                </div>

                <div className="col-md-6">
                  <TextValidator
                    margin="dense"
                    id="phone"
                    name="Phone"
                    value={user.spec.phone}
                    label="Phone"
                    onChange={handleAccountChange("phone")}
                    fullWidth
                  />
                </div>
                <div className="col-md-6" />
              </>
            }
          </div>
        </ValidatorForm>
      </Paper>
    </>
  );
};

export default Profile;

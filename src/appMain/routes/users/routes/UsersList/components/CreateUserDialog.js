import React from "react";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Button,
  IconButton,
  Paper,
} from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import T from "i18n-react";

const CreateUserDialog = (props) => {
  const {
    open,
    user,
    handleCreateWorkloadClose,
    handleRoleChange,
    handleAccountChange,
    handleAdduser,
    handleAddAnotherRole,
    handleRemoveRole,
    roles,
    projectsList,
  } = props;
  const selectedRoles = user.roles;
  if (!open) return null;
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCreateWorkloadClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {user.account.id ? <span>Manage Roles</span> : <span>New User</span>}
        </DialogTitle>
        <ValidatorForm
          noValidate
          autoComplete="off"
          onSubmit={handleAdduser}
          onError={(errors) => console.log(errors)}
        >
          <DialogContent className="pt-0">
            <DialogContentText style={{ fontSize: "14px" }}>
              {user.account.id ? (
                <span>Select the role you'd like to assign this user.</span>
              ) : (
                <T.span text="user.create.dialog.description" />
              )}
            </DialogContentText>

            <div className="row">
              <div className="col-md-12">
                <TextValidator
                  autoFocus
                  required
                  margin="dense"
                  id="username"
                  name="Email"
                  value={user.account.username}
                  label="Email"
                  onChange={handleAccountChange("username")}
                  fullWidth
                  disabled={user.account.id}
                  validators={["required", "isEmail"]}
                  errorMessages={[
                    "this field is required",
                    "email is not valid",
                  ]}
                />
              </div>

              <div className="col-md-6">
                <TextValidator
                  required
                  margin="dense"
                  id="first_name"
                  name="First Name"
                  value={user.account.first_name}
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
                  value={user.account.last_name}
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
                  value={user.account.phone}
                  label="Phone"
                  onChange={handleAccountChange("phone")}
                  fullWidth
                  // validators={["required"]}
                  // errorMessages={["this field is required"]}
                />
              </div>
              <div className="col-md-6" />

              {selectedRoles.map((role, index) => {
                return (
                  <div className="col-md-12" key={index}>
                    <div className="row">
                      <div className="col-md-6">
                        <TextValidator
                          key={index}
                          // required
                          id="role"
                          select
                          label="Role"
                          name="Role"
                          value={role.role.id}
                          onChange={handleRoleChange("role", index)}
                          SelectProps={{}}
                          helperText=""
                          margin="normal"
                          fullWidth
                          // validators={["required"]}
                          // errorMessages={["this field is required"]}
                        >
                          {roles.map((option, i) => (
                            <MenuItem key={i} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextValidator>
                      </div>
                      {role?.role?.scope === "PROJECT" && (
                        <div className="col-md-5">
                          <TextValidator
                            key={index}
                            required
                            id="project"
                            select
                            label="Project"
                            name="project"
                            value={role.project.id}
                            onChange={handleRoleChange("project", index)}
                            SelectProps={{}}
                            helperText=""
                            margin="normal"
                            fullWidth
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                          >
                            {projectsList.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </TextValidator>
                        </div>
                      )}
                      {selectedRoles.length > 1 && (
                        <div className="col-md-1 p-0 mt-4">
                          <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={handleRemoveRole(index)}
                          >
                            <i className="zmdi zmdi-close text-red" />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="col-md-12">
                <Button
                  color="primary"
                  id="add_another_role"
                  onClick={handleAddAnotherRole}
                >
                  + Add Another Role
                </Button>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCreateWorkloadClose}
              color="accent"
              id="add_user_cancel"
            >
              <T.span text="user.create.dialog.cancel" />
            </Button>
            <Button type="submit" color="primary" id="add_user_change_create">
              {user.account.id ? (
                <span>Save</span>
              ) : (
                <T.span text="user.create.dialog.create" />
              )}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </div>
  );
};

export default CreateUserDialog;

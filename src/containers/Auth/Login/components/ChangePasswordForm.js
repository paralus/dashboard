import React from "react";
import T from "i18n-react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Button from "@material-ui/core/Button";

const ChangePasswordForm = ({
  isChangePasswordError,
  auth,
  change_password,
  handleChangePassword,
  handlePasswordChangeAttributes,
}) => {
  return (
    <>
      <h2>
        <T.span text="account.change_password.dialog.title" />
      </h2>
      {isChangePasswordError && (
        <T.span
          id="message-id"
          style={{ color: "red" }}
          text={auth.error.details[0].detail}
        />
      )}
      <ValidatorForm
        instantValidate={false}
        debounceTime={1500}
        autoComplete="off"
        onSubmit={handleChangePassword}
      >
        <div className="row mt-4">
          <div className="col-md-12">
            <TextValidator
              label="New Password"
              name="password"
              fullWidth
              required
              type="password"
              value={change_password.password}
              validators={["required", "passwordLength"]}
              errorMessages={[
                "this field is required",
                <T.span text="signup.password_length" />,
              ]}
              onChange={handlePasswordChangeAttributes("password")}
            />
          </div>
          <div className="col-md-12">
            <TextValidator
              label="Repeat password"
              name="confirm_password"
              fullWidth
              required
              type="password"
              value={change_password.confirm_password}
              validators={["isPasswordMatch", "required"]}
              errorMessages={["password mismatch", "this field is required"]}
              onChange={handlePasswordChangeAttributes("confirm_password")}
            />
          </div>
        </div>
        <div className="mb-3">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            // onClick={this.handleChangePassword}
          >
            Change Password
          </Button>
        </div>
      </ValidatorForm>
    </>
  );
};

export default ChangePasswordForm;

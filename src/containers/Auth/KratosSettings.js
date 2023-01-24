import React, { useState, useEffect } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import { newKratosSdk } from "actions/Auth";
import { connect } from "react-redux";
import { AxiosError } from "axios";
import T from "i18n-react";
import { useQuery } from "utils/helpers";
import PageLayout from "./Login/components/PageLayout";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import tealTheme from "../themes/tealTheme";
import paraluslogo from "../../assets/images/logolarge.png";
import {
  userLogout,
  updateForceReset,
  getUserSessionInfo,
} from "actions/index";

const KratosSettings = (props) => {
  const { query } = useQuery();
  const flowid = query.get("flow");
  const userid = query.get("userid");
  const history = useHistory();

  // NOTE: flow might be needed on allowing this ui to change other attributes
  const [flow, setFlow] = useState(undefined);
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [csrf_token, setCSRF] = useState(undefined);
  let [message, setMessage] = useState("");
  let [resetSuccess, setResetSuccess] = useState(false);
  const [userId, setUserId] = useState("");

  const getSettingsFlow = () =>
    newKratosSdk()
      .initializeSelfServiceSettingsFlowForBrowsers(undefined)
      .then(({ data: flow }) => {
        setFlow(flow);
        flow.ui.nodes.forEach((node) => {
          if (node.attributes.name === "csrf_token") {
            setCSRF(node.attributes.value);
          }
        });
      })
      .catch(console.error);

  useEffect(() => {
    props.getUserSessionInfo();
    if (userid) {
      // 👇️ delete each query param
      setUserId(userid);
      query.delete("userid");
      history.replace({
        search: query.toString(),
      });
    }
  }, []);

  useEffect(
    (_) => {
      getSettingsFlow();
      ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
        return value === password;
      });
      ValidatorForm.addValidationRule("passwordLength", (value) => {
        return value.length >= 8;
      });
      ValidatorForm.addValidationRule("isPasswordOk", (value) => {
        return value.length > 0;
      });
      setMessage("");
    },
    [password, confirm_password]
  );

  const handleChangePassword = () => {
    if (password === undefined || password === "") {
      return;
    }
    if (password.length < 8) {
      return;
    }
    if (password !== confirm_password) {
      return;
    }
    newKratosSdk()
      .submitSelfServiceSettingsFlow(flowid ?? flow.id, {
        csrf_token,
        method: "password",
        password: password,
      })
      .then(async ({ data }) => {
        if (data.ui.messages) {
          // flowid is present when the url contains flowid as parameter but for redirects this property is not populated.
          // e.g. just after deployment installation instruction presents the reset password recovery link with this property as set.
          if (!!flowid) {
            setMessage("Your password has been reset.");
            setResetSuccess(true);
          } else {
            // this bock executes for all users, when forceReset is true and users are forced to reset their password instead of using the auto generated password
            let scb = function () {
              setMessage("Your password has been reset.");
              setResetSuccess(true);
            };
            const { userAndRoleDetail } = props;
            console.log(userAndRoleDetail);
            await props.updateForceReset(userAndRoleDetail, scb, handleError);
          }
        }
      })
      .catch(async (err) => {
        handleError(err);
      });
  };

  const handleError = function (err) {
    if (err.response?.status === 400) {
      // Yup, it is!
      if (err.response?.data.ui.nodes) {
        setMessage(err.response?.data?.ui?.nodes[6].messages[0].text);
      }
      return;
    } else if (err.response?.status === 403) {
      // Yup, it is!
      if (err.response?.data.error?.reason) {
        setMessage(err.response?.data?.error?.reason);
      } else {
        setMessage(err.response?.data?.message);
      }
    } else {
      console.log(err);
    }
  };

  const handlePasswordChangeAttributes = (event) =>
    setPassword(event.target.value);

  const handleConfirmPasswordChangeAttributes = (event) =>
    setConfirmPassword(event.target.value);

  return (
    <>
      {/* NOTE: map needed if need to generate multiple nodes for generic settings */}
      {/* {[...flow.ui].map((uiNode, i) => ( */}
      {/* <div key={i}> */}
      <MuiThemeProvider theme={createTheme(tealTheme)}>
        <PageLayout>
          <ValidatorForm
            instantValidate={false}
            debounceTime={1500}
            autoComplete="off"
            onSubmit={handleChangePassword}
          >
            <img src={paraluslogo} alt="logo" className="img-fluid" />
            <div style={{ marginTop: "25px", marginBottom: "25px" }}>
              <div className="row mt-4">
                <div className="col-md-12">
                  <TextValidator
                    label="New Password"
                    name="password"
                    fullWidth
                    required
                    type="password"
                    value={password}
                    validators={["required", "passwordLength"]}
                    errorMessages={[
                      "this field is required",
                      <T.span text="signup.password_length" />,
                    ]}
                    onChange={handlePasswordChangeAttributes}
                  />
                </div>
                <div className="col-md-12">
                  <TextValidator
                    label="Repeat Password"
                    name="confirm_password"
                    fullWidth
                    required
                    type="password"
                    value={confirm_password}
                    validators={["isPasswordMatch", "required", "isPasswordOk"]}
                    errorMessages={[
                      "password mismatch",
                      "this field is required",
                    ]}
                    onChange={handleConfirmPasswordChangeAttributes}
                  />
                </div>
                <div className="col-md-12">
                  <b>{message}</b>
                  {resetSuccess && (
                    <b>
                      {" "}
                      Click{" "}
                      <a style={{ color: "teal" }} href="/">
                        here
                      </a>{" "}
                      to proceed to the home page.
                    </b>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-3">
              <Button variant="contained" color="primary" type="submit">
                Set Password
              </Button>
            </div>
          </ValidatorForm>
        </PageLayout>
      </MuiThemeProvider>
      {/* </div> */}
      {/* ))} */}
    </>
  );
};

const mapStateToProps = ({ settings }) => {
  const { userAndRoleDetail } = settings;
  return {
    userAndRoleDetail,
  };
};
export default connect(mapStateToProps, {
  userLogout,
  getUserSessionInfo,
  updateForceReset,
})(KratosSettings);

import React, { useState, useEffect } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Button from "@material-ui/core/Button";
import { newKratosSdk } from "actions/Auth";
import { AxiosError } from "axios";
import T from "i18n-react";
import { useQuery } from "utils/helpers";
import PageLayout from "./Login/components/PageLayout";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import tealTheme from "../themes/tealTheme";

const KratosSettings = (props) => {
  const { query } = useQuery();
  const flowid = query.get("flow");

  // NOTE: flow might be needed on allowing this ui to change other attributes
  const [flow, setFlow] = useState(undefined);
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [csrf_token, setCSRF] = useState(undefined);

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

  useEffect(
    (_) => {
      getSettingsFlow();
      ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
        return value === password;
      });
      ValidatorForm.addValidationRule("passwordLength", (value) => {
        return value.length >= 8;
      });
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
      .submitSelfServiceSettingsFlow(flowid, undefined, {
        csrf_token,
        method: "password",
        password: password,
      })
      .then(({ data }) => {
        if (data.ui.messages) {
          alert(data?.ui?.messages[0].text);
        }
      })
      .catch(async (err) => {
        if (err.response?.status === 400) {
          // Yup, it is!
          if (err.response?.data.ui.nodes) {
            alert(err.response?.data?.ui?.nodes[6].messages[0].text);
          }
        }
      });
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
                    label="Repeat password"
                    name="confirm_password"
                    fullWidth
                    required
                    type="password"
                    value={confirm_password}
                    validators={["isPasswordMatch", "required"]}
                    errorMessages={[
                      "password mismatch",
                      "this field is required",
                    ]}
                    onChange={handleConfirmPasswordChangeAttributes}
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleChangePassword}
              >
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

export default KratosSettings;

import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { newKratosSdk } from "actions/Auth";
import { useLocation } from "react-router-dom";
import PageLayout from "./Login/components/PageLayout";
import { createTheme, MuiThemeProvider } from "@material-ui/core/styles";
import tealTheme from "../themes/tealTheme";
import { useHistory } from "react-router";

const style = {
  helpText: {
    marginBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "20px",
    paddingTop: "20px",
    paddingBottom: "20px",
    fontSize: "18px",
    fontStyle: "italic",
    color: "rgb(117, 117, 117)",
  },
};

const ErrorPage = (props) => {
  const history = useHistory();
  const [errorInfo, setErrorInfo] = useState(null);
  const search = useLocation().search;
  const errorCodeInput = new URLSearchParams(search).get("id");

  const moveToDashboard = () => {
    history.push({
      pathname: "/",
    });
  };

  const getKratosError = (errorCode) => {
    newKratosSdk()
      .getSelfServiceError(errorCode)
      .then(({ data: resp }) => {
        if (resp) {
          setErrorInfo(resp.error);
        }
      })
      .catch((err) => {
        setErrorInfo(null);
        switch (err.response?.status) {
          case (404, 403, 410):
            // The error id could not be found or fetched or
            // expired. Let's just redirect home!
            moveToDashboard();
        }
      });
  };

  useEffect((_) => {
    if (errorCodeInput && errorCodeInput !== "") {
      getKratosError(errorCodeInput);
    }
  }, []);

  return (
    <>
      <MuiThemeProvider theme={createTheme(tealTheme)}>
        <PageLayout alignItems="left">
          <h1
            className="p-0"
            style={{ marginBottom: "10px", color: "#ff9800", fontSize: "55px" }}
          >
            Oops!
          </h1>
          <p style={style.helpText} className="pt-0">
            An error occured, please contact your administrator to get it fixed.
          </p>
          {errorInfo && errorInfo !== null ? (
            <>
              <Paper variant="outlined" style={{ marginBottom: "50px" }}>
                {errorInfo.code != null ? (
                  <p style={{ color: "dodgerblue", fontSize: "16px" }}>
                    Code : {errorInfo.code}
                  </p>
                ) : null}
                {errorInfo.message != null ? (
                  <p style={{ color: "dodgerblue", fontSize: "16px" }}>
                    Message : {errorInfo.message}
                  </p>
                ) : null}
                {errorInfo.reason != null ? (
                  <p style={{ color: "dodgerblue", fontSize: "16px" }}>
                    Reason : {errorInfo.reason}
                  </p>
                ) : null}
              </Paper>
            </>
          ) : null}
          <Button variant="contained" color="primary" onClick={moveToDashboard}>
            Go to Homepage
          </Button>
        </PageLayout>
      </MuiThemeProvider>
    </>
  );
};

export default ErrorPage;

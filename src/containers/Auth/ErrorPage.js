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
  const errorCodeInput = new URLSearchParams(search).get("error");

  const moveToDashboard = (e) => {
    history.push({
      pathname: "/",
    });
  };

  const getKratosError = (errorCode) =>
    newKratosSdk()
      .getSelfServiceError(errorCode)
      .then(({ resp }) => {
        if (resp && resp.length) {
          setErrorInfo(resp[0]);
        }
      })
      .catch((errorResp) => {
        setErrorInfo(null);
      });

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
            style={{ marginBottom: "50px", color: "#ff9800", fontSize: "55px" }}
          >
            Oops
          </h1>
          <p style={style.helpText} className="pt-0">
            An error occured, please contact your administrator to get it fixed
            ...!!!{" "}
          </p>
          {errorInfo && errorInfo !== null ? (
            <>
              <Paper variant="outlined" style={{ marginBottom: "50px" }}>
                <span style={{ color: "dodgerblue", fontSize: "16px" }}>
                  Code : {errorInfo.code}
                </span>
                <br></br>
                <span style={{ color: "dodgerblue", fontSize: "16px" }}>
                  Message : {errorInfo.message}
                </span>
              </Paper>
            </>
          ) : null}
          <Button variant="contained" color="primary" onClick={moveToDashboard}>
            Go to Homepage
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            variant="contained"
            color="primary"
            target={"_blank"}
            href="https://www.paralus.io/docs"
          >
            Paralus Docs
          </Button>
        </PageLayout>
      </MuiThemeProvider>
    </>
  );
};

export default ErrorPage;

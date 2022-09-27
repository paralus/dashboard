import React, { useState, useEffect } from "react";
import T from "i18n-react";
import Button from "@material-ui/core/Button";
import AppSnackbar from "components/AppSnackbar";
import { getKubeConfig } from "actions/index";
import { capitalizeFirstLetter } from "../../../../../utils";

const DownloadKubeconfig = ({ user, withIcon }) => {
  const [config, setConfig] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    if (config) {
      const textFileAsBlob = new Blob([config], { type: "text/plain" });
      const fileNameToSaveAs = `kubeconfig-${user.metadata.name}.yaml`;

      const downloadLink = document.createElement("a");
      downloadLink.download = fileNameToSaveAs;
      downloadLink.innerHTML = "Download File";
      if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
      } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
      }
      downloadLink.click();
    }
  }, [config]);

  return (
    <>
      {withIcon ? (
        <Button
          variant="contained"
          className="jr-btn jr-btn-label left text-nowrap text-white"
          onClick={getKubeConfig(user.metadata.id, setConfig, () =>
            setAlert({
              show: true,
              message: "Error Downloading Kubeconfig. Try again later.",
              severity: "error",
            })
          )}
          style={{ marginRight: "15px" }}
          color="primary"
        >
          <i className="zmdi zmdi-download zmdi-hc-fw " />
          <span>Download Kubeconfig</span>
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          className="mr-4"
          onClick={getKubeConfig(user?.metadata.id, setConfig, () =>
            setAlert({
              show: true,
              message: "Error Downloading Kubeconfig. Try again later.",
              severity: "error",
            })
          )}
        >
          <T.span text="tools.download_kubeconfig_button" />
        </Button>
      )}
      <AppSnackbar
        open={alert.show}
        severity={alert.severity}
        message={capitalizeFirstLetter(alert.message)}
        closeCallback={() =>
          setAlert({ show: false, message: "", severity: "error" })
        }
      />
    </>
  );
};

export default DownloadKubeconfig;

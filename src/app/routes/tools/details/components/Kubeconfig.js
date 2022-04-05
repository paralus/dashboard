import React, { useState, useEffect } from "react";
import CardBox from "components/CardBox/index";
import T from "i18n-react";
import RafaySnackbar from "components/RafaySnackbar";
import RafayConfirmIconAction from "components/RafayConfirmIconAction";
import { revokeSelfKubeconfig } from "actions/index";
import DownloadKubeconfig from "./DownloadKubeconfig";

const Kubeconfig = ({ user }) => {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "error",
  });

  const handleRevokeKubeconfig = (_, user) => {
    revokeSelfKubeconfig(user.metadata.id)
      .then((_) => {
        setAlert({
          show: true,
          message: (
            <>
              <span className="mr-2">Kubeconfig Revoked for</span>
              <b>{user.metadata.name}</b>
            </>
          ),
          severity: "success",
        });
      })
      .catch((error) => {
        setAlert({
          show: true,
          message:
            error?.response?.data?.message.toString() || "Unexpected Error",
          severity: "error",
        });
      });
  };

  return (
    <div className="row">
      <CardBox
        styleName="col-lg-6"
        childrenStyle="d-flex"
        heading={<T.span text="tools.kubeconfig_section" />}
      >
        <div className="row w-100">
          <div className="col-md-12 pt-2">
            <DownloadKubeconfig user={user} />
          </div>
          <div
            className="col-md-12 pt-2"
            style={{ color: "rgb(117, 117, 117)" }}
          >
            <T.span text="tools.download_kubeconfig_help" />
            <span>
              <b>{user.metadata.name}</b>
            </span>
          </div>
          <div className="col-md-12" style={{ padding: "15px" }} />
          <div className="col-md-12">
            <RafayConfirmIconAction
              buttonText="Revoke Kubeconfig"
              action={(event) => handleRevokeKubeconfig(event, user)}
              confirmText={
                <>
                  <span className="mr-2">
                    Are you sure you want to revoke kubectlconfig for
                  </span>
                  <b>{user?.metadata.name}</b>
                </>
              }
              tooltip="Revoke Kubeconfig"
            />
          </div>
          <div
            className="col-md-12 pt-2"
            style={{ color: "rgb(117, 117, 117)" }}
          >
            Revoke Kubeconfig for&nbsp;
            <span>
              <b>{user.metadata.name}</b>
            </span>
          </div>
        </div>
      </CardBox>
      <RafaySnackbar
        open={alert.show}
        severity={alert.severity}
        message={alert.message}
        closeCallback={() =>
          setAlert({ show: false, message: "", severity: "error" })
        }
      />
    </div>
  );
};

export default Kubeconfig;

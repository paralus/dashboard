import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { getCLiConfig } from "actions/index";
import CardBox from "components/CardBox/index";
import T from "i18n-react";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Kubeconfig from "./components/Kubeconfig";
import DownloadCli from "../../users/routes/downloadCli/downloadCli.js";

class ToolsDetail extends React.Component {
  constructor(props, context) {
    super(props, context);

    let organization = null;
    if (props.detail) {
      organization = props.detail;
    }

    this.state = {};
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (this.state.cliConfigCheck) {
      this.handleDownloadConfig(props.cliConfigData);
      this.state.cliConfigCheck = false;
    }

    this.setState({ ...this.state });
  }

  callCliConfig = () => {
    this.props.getCLiConfig();
    this.state.cliConfigCheck = true;
    this.setState({ ...this.state });
  };

  handleDownloadConfig = (downloadConfig) => {
    const filename = `${this.props.userAndRoleDetail.organization.name}-${this.props.userAndRoleDetail.account.username}`;
    const jsonstr = JSON.stringify(downloadConfig, null, 4);
    const textFileAsBlob = new Blob([jsonstr], {
      type: "application/json",
    });
    const fileNameToSaveAs = `${filename}.json`;

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
  };

  handleManageKeys = () => {
    const { history, userAndRoleDetail } = this.props;
    let path = "managekeys";
    if (userAndRoleDetail.account.is_sso) {
      path = "managessokeys";
    }
    history.push(
      `${history.location.pathname}/${path}/${userAndRoleDetail.account.id}`
    );
  };

  render() {
    return (
      <div className="app-wrapper">
        <h1 className="p-0" style={{ marginBottom: "20px", color: "#ff9800" }}>
          <T.span text="tools.title" />
        </h1>
        <p
          style={{
            marginBottom: "0px",
            padding: "20px",
            fontStyle: "italic",
            color: "rgb(117, 117, 117)",
          }}
          className="pl-0 pt-0"
        >
          <T.span text="tools.helptext" />
        </p>
        <div className="row">
          <CardBox
            styleName="col-lg-6"
            childrenStyle="d-flex"
            heading={<T.span text="tools.cli_section" />}
          >
            <div className="row w-100">
              <div className="col-md-6 pt-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.setState({ open: true })}
                >
                  <T.span text="tools.download_cli_button" />
                </Button>
              </div>
              <div
                className="col-md-12 pt-2"
                style={{ color: "rgb(117, 117, 117)" }}
              >
                <T.span text="tools.download_cli_help" />
              </div>

              <div className="col-md-12" style={{ padding: "15px" }} />

              <div className="col-md-6 pt-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.callCliConfig}
                >
                  <T.span text="tools.download_cli_config_button" />
                </Button>
              </div>
              <div
                className="col-md-12 pt-2"
                style={{ color: "rgb(117, 117, 117)" }}
              >
                <T.span text="tools.download_cli_config_text" />
              </div>
            </div>
          </CardBox>
        </div>

        <Kubeconfig user={this.props.userAndRoleDetail.account} />

        <div className="row">
          <CardBox
            styleName="col-lg-6"
            childrenStyle="d-flex"
            heading={<T.span text="API &amp; Registry Keys" />}
          >
            <div className="row w-100">
              <div className="col-md-6 pt-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleManageKeys}
                >
                  <T.span text="manage keys" />
                </Button>
              </div>
              {this.props.userAndRoleDetail &&
                this.props.userAndRoleDetail.account &&
                this.props.userAndRoleDetail.account.username && (
                  <div
                    className="col-md-12 pt-2"
                    style={{ color: "rgb(117, 117, 117)" }}
                  >
                    Manage{" "}
                    <b>{this.props.userAndRoleDetail.account.username}</b>
                    's API keys and Registry Authorization keys.
                  </div>
                )}
            </div>
          </CardBox>
        </div>

        <Dialog
          open={this.state.open || false}
          onClose={() => this.setState({ open: false })}
          onBackdropClick={() => this.setState({ open: false })}
          maxWidth="lg"
        >
          <DialogContent>
            <DownloadCli />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ open: false })}
              color="accent"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = ({ settings, Tools }) => {
  const { userAndRoleDetail, users } = settings;
  const { cliConfigData } = Tools;
  return { userAndRoleDetail, cliConfigData, users };
};
export default withRouter(
  connect(mapStateToProps, { getCLiConfig })(ToolsDetail)
);

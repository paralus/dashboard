import React from "react";
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  LinearProgress,
  Select,
  Switch,
  TextField,
  Paper,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Step,
  Stepper,
  Tooltip,
  StepLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { uploadMetaDataFile } from "actions/IDPs";
import RafaySnackbar from "components/RafaySnackbar";

class UploadMedaData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "url",
    };
  }

  componentDidMount() {
    if (this.props.data && this.props.data.metadata_filename) {
      this.setState({ fileName: this.props.data.metadata_filename });
    }
  }

  successCallback = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: "Upload Successfull",
      alertSeverity: "success",
    });
  };

  errorCallback = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: "Upload Failed",
      alertSeverity: "error",
    });
  };

  handleResponseErrorClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  handleUploadClick = () => {
    this.fileEl.click();
  };

  inputFileChanged = (e) => {
    const file = e.target.files[0];
    this.state.fileName = file.name;
    this.state.fileData = file;
    this.state.fileDataError = false;
    this.props.setMetaDataFile(this.state.fileData);
    this.setState({ ...this.state });
  };

  render() {
    const { showAlert, alertMessage, alertSeverity } = this.state;
    return (
      <div className="p-4">
        <div className="row">
          <div className="col-sm-2">Metadata File (XML)</div>
          <div className="col-sm-2">
            <span
              style={{ color: "teal", cursor: "pointer" }}
              onClick={this.handleUploadClick}
            >
              <i className="zmdi zmdi-upload mr-2" />
              Upload
            </span>
          </div>
          <div className="col-sm-8">
            {this.state.fileName?.length > 0 && (
              <Tooltip title="Download" placement="right">
                <a
                  style={{
                    color: "teal",
                    textDecoration: "none",
                  }}
                  download={this.state.fileName}
                  href={`/auth/v1/sso/idp/${this.props.idpId}/download_metadata/`}
                >
                  <i className="zmdi zmdi-download mr-2" />
                  {this.state.fileName}
                </a>
              </Tooltip>
            )}
            <input
              type="file"
              ref={(el) => {
                this.fileEl = el;
              }}
              accept={["*"]}
              multiple={false}
              style={{ display: "none" }}
              onChange={this.inputFileChanged}
            />
          </div>
        </div>
        <RafaySnackbar
          open={showAlert}
          severity={alertSeverity}
          message={alertMessage}
          closeCallback={this.handleResponseErrorClose}
        />
      </div>
    );
  }
}

export default withRouter(
  connect(null, { uploadMetaDataFile })(UploadMedaData)
);

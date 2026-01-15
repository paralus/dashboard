import React from "react";

import TextField from "@material-ui/core/TextField";
import CardBox from "components/CardBox/index";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  getOrganization,
  saveOrganization,
  resetOrganizationError,
  resetOrganizationSuccess,
  getOrgKubeconfigValidity,
  setOrgKubeconfigValidity,
} from "actions/index";
import Spinner from "../../../components/Spinner";
import KubeconfigValidity from "../users/routes/UserDetail/components/KubeconfigValidity";

class Settings extends React.Component {
  constructor(props, context) {
    super(props, context);

    let organization = null;
    if (props.detail) {
      organization = props.detail;
    }

    this.state = {
      data: organization, // Object.assign({}, detail.data),
      isResponseError: false,
      isOrgSaved: false,
      mfaEnableDialog: false,
      isSaveKubeconfigDisabled: true,
      showAlert: false,
      alertSeverity: "error",
      alertMessage: "",
      kubectlSettings: null,
    };
  }

  componentDidMount() {
    this.props.getOrganization(
      this.props.userAndRoleDetail.metadata.partner,
      this.props.userAndRoleDetail.metadata.organization
    );
    if (this.props?.userAndRoleDetail) {
      getOrgKubeconfigValidity(this.props.detail.metadata.id).then((res) => {
        this.setState({
          kubectlSettings: res?.data,
        });
      });
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.detail) {
      this.state.data = props.detail;
    }
    if (props.organization && props.organization.isOrganizationResponseError) {
      this.state.isResponseError = true;
    } else {
      this.state.isResponseError = false;
    }
    if (props.isOrganizationSaved) {
      this.state.isOrgSaved = true;
    } else {
      this.state.isOrgSaved = false;
    }

    this.state.savedisabled = true;
    this.setState({ ...this.state });
  }

  handleSaveOrganization = () => {
    this.props.saveOrganization(this.state.data);
  };

  handleChange = (name) => (event) => {
    if (name === "address_line1") {
      this.state.data.spec.addressLine1 = event.target.value;
    }
    if (name === "address_line2") {
      this.state.data.spec.addressLine2 = event.target.value;
    }
    if (name === "city") {
      this.state.data.spec.city = event.target.value;
    }
    if (name === "state") {
      this.state.data.spec.state = event.target.value;
    }
    if (name === "country") {
      this.state.data.spec.country = event.target.value;
    }
    if (name === "zipcode") {
      this.state.data.spec.zipcode = event.target.value;
    }
    this.state.savedisabled = false;
    this.setState(this.state);
  };

  handleResponseSaveClose = () => {
    this.props.resetOrganizationSuccess();
  };

  handleSaveValidity = (settings) => {
    const orgId = this.props?.detail?.metadata.id;
    if (orgId) {
      return setOrgKubeconfigValidity(orgId, settings);
    }
    throw Error("Unknown Error");
  };

  getErrorMessage = () => {
    if (!this.props.organization.error) {
      return null;
    }
    return (
      <span id="messagethis.handleSaveOrganization-id">
        <ul className="list-group" />
      </span>
    );
  };

  render() {
    if (!this.state.data || !this.state.data.metadata.name) {
      return null;
    }

    const disabled = false;
    const organization = this.state.data;

    return (
      <Spinner loading={this.props.loading} addHeight hideChildren>
        <div className="app-wrapper">
          <h1
            className="p-0"
            style={{ marginBottom: "20px", color: "#ff9800" }}
          >
            Settings
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
            Specify additional information about this Organization.
          </p>
          <div className="row col-md-12 mb-3">
            <KubeconfigValidity
              settings={this.state.kubectlSettings}
              onSave={this.handleSaveValidity}
              orgSetting
              orgId={organization.metadata.id}
            />
          </div>
          <div className="row">
            <CardBox
              styleName="col-lg-6"
              childrenStyle="d-flex"
              heading="Address"
            >
              <div className="row mt-4">
                <div className="col-md-12">
                  <TextField
                    disabled
                    margin="dense"
                    id="name"
                    value={organization.metadata.name}
                    label="Name"
                    fullWidth
                  />
                </div>
                <div className="col-md-12">
                  <TextField
                    disabled={disabled}
                    margin="dense"
                    id="address_line1"
                    value={organization.spec.addressLine1}
                    onChange={this.handleChange("address_line1")}
                    label="Address 1"
                    fullWidth
                  />
                </div>
                <div className="col-md-12">
                  <TextField
                    disabled={disabled}
                    margin="dense"
                    id="address_line2"
                    value={organization.spec.addressLine2}
                    onChange={this.handleChange("address_line2")}
                    label="Address 2"
                    fullWidth
                  />
                </div>
                <div className="col-md-12">
                  <TextField
                    disabled={disabled}
                    margin="dense"
                    id="city"
                    value={organization.spec.city}
                    onChange={this.handleChange("city")}
                    label="City"
                    fullWidth
                  />
                </div>
                <div className="col-md-12">
                  <TextField
                    disabled={disabled}
                    margin="dense"
                    id="state"
                    value={organization.spec.state}
                    onChange={this.handleChange("state")}
                    label="State"
                    fullWidth
                  />
                </div>
                <div className="col-md-12">
                  <TextField
                    disabled={disabled}
                    margin="dense"
                    id="country"
                    value={organization.spec.country}
                    onChange={this.handleChange("country")}
                    label="Country"
                    fullWidth
                  />
                </div>
                <div className="col-md-12">
                  <TextField
                    disabled={disabled}
                    margin="dense"
                    id="zipcode"
                    value={organization.spec.zipcode}
                    onChange={this.handleChange("zipcode")}
                    label="Zip"
                    fullWidth
                  />
                </div>

                {disabled === false && (
                  <div className="mt-2 col-md-12 d-flex justify-content-end">
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={this.state.savedisabled}
                        onClick={this.handleSaveOrganization}
                        className="jr-btn"
                        type="submit"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardBox>
          </div>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.isOrgSaved || false}
            onClose={this.handleResponseSaveClose}
            SnackbarContentProps={{
              "aria-describedby": "message-id",
            }}
            className="mb-3 bg-success"
            message="Successfully updated organization."
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleResponseSaveClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
        </div>
      </Spinner>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { organization, userAndRoleDetail } = settings;
  const { detail, isOrganizationSaved, loading } = organization;
  return { detail, userAndRoleDetail, isOrganizationSaved, loading };
};
export default withRouter(
  connect(mapStateToProps, {
    getOrganization,
    saveOrganization,
    resetOrganizationError,
    resetOrganizationSuccess,
  })(Settings)
);

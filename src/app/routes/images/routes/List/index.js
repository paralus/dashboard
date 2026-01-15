import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  pullImages,
  pullImageTags,
  deleteImage,
  resetImageErrorResponse,
  getRegistryDetail,
} from "actions/index";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import T from "i18n-react";
import DataTable from "./components/DataTable";

const style = {
  helpText: {
    marginBottom: "0px",
    paddingLeft: "0px",
    paddingRight: "20px",
    paddingTop: "20px",
    paddingBottom: "20px",
    fontStyle: "italic",
    color: "rgb(117, 117, 117)",
  },
};

class List extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      error: null,
      isResponseError: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.getRegistryDetail(
      this.props.match.params.registryId,
      this.props.currentProject.id,
    );
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.isResponseError) {
      this.state.isResponseError = true;
      this.state.error = props.error;
    }
    this.setState({ ...this.state });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isResponseError) {
      // this.state.certificate.isCertificateResponseError = true;
      // this.state.certificate.error = this.props.getS3Credentials.error;
      // this.props.getS3Credentials(rowsPerPage, offset, searchText, orderBy, order);
    }
  }

  getErrorMessage = () => {
    if (!this.state.error) {
      return null;
    }

    return (
      <span id="message-id">
        <ul className="list-group">
          {this.state.error.details.map((li, index) => (
            <li
              className="list-group-item"
              key={li.error_code}
              style={{
                backgroundColor: "transparent",
                border: "transparent",
              }}
            >
              {li.detail}
            </li>
          ))}
        </ul>
      </span>
    );
  };

  handleResponseErrorClose = () => {
    this.state.isResponseError = false;
    this.props.resetImageErrorResponse();
    this.setState(this.state);
  };

  render() {
    let data = [];
    if (this.props.list) {
      data = this.props.list;
    }

    return (
      <div>
        <div
          className="d-sm-flex justify-content-sm-between align-items-sm-center"
          style={{ marginBottom: 0 }}
        >
          <Breadcrumb
            className="mb-4 mt-0 pl-0"
            tag="nav"
            style={{ backgroundColor: "transparent" }}
          >
            <BreadcrumbItem
              active={false}
              tag="a"
              key="nav1"
              color="primary"
              href="#/app/registries/"
            >
              <T.span
                style={{ color: "teal" }}
                text="registries.tab_name.registries"
              />
            </BreadcrumbItem>
            <BreadcrumbItem active tag="a" key="nav2">
              {this.props.registry ? this.props.registry.name : ""}
            </BreadcrumbItem>
            <BreadcrumbItem active tag="span" key="nav3">
              <T.span text="registries.tab_name.repositories" />
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <h1 className="p-0" style={{ marginBottom: "20px", color: "#ff9800" }}>
          Repositories
        </h1>
        {data.length === 0 ? (
          <p style={style.helpText} className="pt-0">
            Use Docker to push images to this registry.
          </p>
        ) : (
          <p style={style.helpText} className="pt-0">
            Your uploaded images listed below. Click on the image to list all
            the uploaded versions.
          </p>
        )}

        <DataTable
          {...this.state}
          list={this.props.list}
          tag_list={this.props.tag_list}
          deleteImage={this.props.deleteImage}
          pullImages={this.props.pullImages}
          pullImageTags={this.props.pullImageTags}
          currentProject={this.props.currentProject}
        />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={this.state.isResponseError}
          onClose={this.handleResponseErrorClose}
          SnackbarContentProps={{
            "aria-describedby": "message-id",
          }}
          className="mb-3"
          message={this.getErrorMessage()}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleResponseErrorClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ Images, Registries, Projects }) => {
  const { list, tag_list, isResponseError, error } = Images;
  const registry = Registries.detail;
  const { currentProject } = Projects;
  return { list, tag_list, isResponseError, error, registry, currentProject };
};

export default withRouter(
  connect(mapStateToProps, {
    pullImages,
    pullImageTags,
    deleteImage,
    resetImageErrorResponse,
    getRegistryDetail,
  })(List),
);

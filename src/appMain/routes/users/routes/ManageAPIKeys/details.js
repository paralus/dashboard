import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getApiKeys,
  deleteApiKey,
  resetUserApiKeyResponse,
} from "actions/index";
import T from "i18n-react";
import CardBox from "components/CardBox/index";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import APIKeys from "./components/apikey";

class ManageAPIKeys extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    this.props.getApiKeys(this.props.match.params.userId, this.props.isSSOUser);
  }

  render() {
    const { history } = this.props;
    if (history.location.pathname.includes("tools")) {
      this.state.toolsPage = true;
    }
    return (
      <div className="app-wrapper">
        {this.state.toolsPage ? (
          <Breadcrumb
            style={{
              padding: "0px",
              backgroundColor: "transparent",
              marginTop: "-10px",
              marginLeft: "-15px",
            }}
          >
            <BreadcrumbItem
              active={false}
              tag="a"
              key="nav1"
              href="#/main/tools"
            >
              <T.span text="tools.title" style={{ color: "teal" }} />
            </BreadcrumbItem>
            <BreadcrumbItem active tag="span" key="nav2">
              Manage Keys
            </BreadcrumbItem>
          </Breadcrumb>
        ) : (
          <Breadcrumb
            className="pl-0"
            style={{
              padding: "0px",
              backgroundColor: "transparent",
              marginTop: "-10px",
              marginLeft: "-15px",
            }}
          >
            <BreadcrumbItem
              active={false}
              tag="a"
              key="nav1"
              href="#/main/users"
            >
              <T.span text="user.breadcrumb.users" style={{ color: "teal" }} />
            </BreadcrumbItem>
            <BreadcrumbItem active tag="span" key="nav2">
              Manage Keys
            </BreadcrumbItem>
          </Breadcrumb>
        )}

        <h3>API Keys</h3>
        <p
          style={{
            marginBottom: "0px",
            padding: "20px",
            fontStyle: "italic",
            color: "rgb(117, 117, 117)",
          }}
          className="pl-0 pt-0"
        >
          API Keys allow you to interact with the system via the RESTful API
          exposed by the platform, along with the CLI. You may create more than
          one API key per user.
        </p>
        <div className="row mb-md-4">
          <CardBox styleName="col-12" cardStyle="p-0">
            <APIKeys
              {...this.props}
              onRef={(ref) => {
                this.apikeyscomponent = ref;
              }}
            />
          </CardBox>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const {
    users,
    roles,
    apikeys,
    apikey,
    regAuthKeys,
    regAuthKey,
    isAPIKeysSuccess,
    isAPIKeysFailure,
    apiKeyErrorMsg,
    isAPIKeyDeleteSuccess,
    isAPIKeyDeleteFailure,
  } = settings;
  return {
    users,
    roles,
    apikeys,
    apikey,
    isAPIKeysSuccess,
    isAPIKeysFailure,
    apiKeyErrorMsg,
    isAPIKeyDeleteSuccess,
    isAPIKeyDeleteFailure,
  };
};
export default withRouter(
  connect(mapStateToProps, {
    getApiKeys,
    deleteApiKey,
    resetUserApiKeyResponse,
  })(ManageAPIKeys),
);

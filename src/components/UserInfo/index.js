import React from "react";
import { Menu, MenuItem } from "@material-ui/core";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import {
  getInitProjects,
  getUserSessionInfo,
  userLogout,
  getLang,
  changePassword,
  organizationLogin,
  getCliDownloadOptions,
  resetCliDownload,
} from "actions/index";
import HelpOutline from "@material-ui/icons/HelpOutline";
// import { getPartnerDetails } from "actions/Partner";
import Profile from "./Profile";

class UserInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
      open: false,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { getUserSessionInfo, getInitProjects } = this.props;
    if (props.isChangeOrgSuccess) {
      this.state.isChangeOrgSuccess = true;
      this.changeOrganizationDialog.close();
      getUserSessionInfo();
    }
    if (props.userAndRoleDetail && !props.isProjectSet) {
      getInitProjects();
    }
    this.setState({ open: false });
  }

  handleClick = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  handleLogout = (event) => {
    const { userLogout } = this.props;
    userLogout();
  };

  // handleLang = name => {
  //   const { getLang } = this.props;
  //   getLang(name);
  //   this.setState({ open: false });
  // };

  handleSettingsClick = () => {
    const { history } = this.props;
    history.push(`/app/settings`);
  };

  handleDownloadCli = (event) => {
    this.setState({ open: false });
    this.paraluscliDownloadDialog.open();
  };

  handleProfileClick = (event) => {
    this.setState({ open: false });
    this.viewProfile.open();
  };

  render() {
    let username = "";
    let isSSOUser = false;
    const { userAndRoleDetail, user } = this.props;
    const { isChangeOrgSuccess, anchorEl, open } = this.state;
    if (userAndRoleDetail) {
      username = userAndRoleDetail.metadata.name;
    } else {
      return null;
    }
    let hasAccess =
      user === null ||
      (!!user && !user.spec.forceReset) ||
      (user.spec.forceReset &&
        user.metadata.name !== userAndRoleDetail.metadata.name);
    // TODO: This is temporary. Add a flag to indicate usertype RC-6789
    if (
      !`${userAndRoleDetail.spec.firstName}${userAndRoleDetail.spec.lastName}`
        .length
    ) {
      isSSOUser = true;
    }

    if (isChangeOrgSuccess) {
      window.location = "/#/login";
    }

    return (
      <div className="user-profile d-flex flex-row align-items-center">
        {/* only show the header profile details if user has already set his password */}
        {hasAccess && (
          <>
            <div className="user-detail">
              <h4
                className="user-name"
                style={{ textTransform: "none" }}
                onClick={this.handleClick}
              >
                {` ${username} `}
                <i className="zmdi zmdi-caret-down zmdi-hc-fw align-middle" />
              </h4>
              {this.props.organization && this.props.organization.detail && (
                <small>{this.props.organization.detail.metadata.name}</small>
              )}
            </div>
            <a
              style={{ color: "#ff9800" }}
              href={
                this.props.partnerDetail?.settings?.docs_link?.length > 0
                  ? this.props.partnerDetail.settings.docs_link
                  : "#"
              }
            >
              <HelpOutline style={{ cursor: "pointer", marginLeft: "20px" }} />
            </a>
            <Menu
              className="user-info"
              id="simple-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={this.handleRequestClose}
              PaperProps={{
                style: {
                  width: 200,
                },
              }}
            >
              <MenuItem
                style={{ height: "0px" }}
                className="p-0"
                onClick={(_) => {}}
              />

              <MenuItem onClick={this.handleProfileClick}>
                <i className="zmdi zmdi-account-circle zmdi-hc-fw mr-2" />
                Profile
              </MenuItem>
              <MenuItem onClick={this.handleLogout}>
                <i className="zmdi zmdi-sign-in zmdi-hc-fw mr-2" />
                Logout
              </MenuItem>
              {/* lang === "english" ?
          <MenuItem onClick={() => this.handleLang("german")}><i
              className="zmdi zmdi-settings zmdi-hc-fw mr-2" />German
          </MenuItem>
          :
          <MenuItem onClick={() => this.handleLang("english")}><i
              className="zmdi zmdi-settings zmdi-hc-fw mr-2" />English
          </MenuItem> */}
            </Menu>
          </>
        )}
        <Profile
          user={userAndRoleDetail}
          onRef={(ref) => {
            this.viewProfile = ref;
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ settings, Projects, Users }) => {
  const {
    account,
    isGetUserDataSuccess,
    isGetUserDataFailed,
    lang,
    isChangePasswordSuccess,
    isChangePasswordError,
    userAndRoleDetail,
    isChangeOrgSuccess,
    auth,
    partnerDetail,
    organization,
  } = settings;
  const { user } = Users;
  const { isProjectSet } = Projects;
  return {
    isGetUserDataSuccess,
    isGetUserDataFailed,
    account,
    lang,
    isChangePasswordSuccess,
    isChangePasswordError,
    userAndRoleDetail,
    isChangeOrgSuccess,
    auth,
    partnerDetail,
    organization,
    isProjectSet,
    user,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getInitProjects,
    getUserSessionInfo,
    userLogout,
    getLang,
    changePassword,
    organizationLogin,
    getCliDownloadOptions,
    resetCliDownload,
  })(UserInfo),
);

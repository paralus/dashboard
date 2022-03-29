/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  editUser,
  getUser,
  getGroups,
  resetUserGroupDeleteError,
} from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import T from "i18n-react";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import RafaySnackbar from "components/RafaySnackbar";
import RafayPageHeader from "components/RafayPageHeader";
import TransferList from "./RafayTransferList/index";

class AddToGroups extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      list: [],
      userId: props.match.params.userId,
      username: "",
      addUsersList: [],
      removeUsersList: [],
      availableGroups: [],
      alertMessage: "",
      alertOpen: false,
      alertSeverity: "error",
      userDetail: {},
      selectedList: [],
    };
  }

  componentDidMount() {
    const { getUser, getGroups } = this.props;
    const { userId } = this.state;
    getUser(userId);
    getGroups();
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { groupsList, userDetail, isGroupDeleteError, error } = props;
    if (userDetail && groupsList && newState.selectedList.length === 0) {
      newState.username = userDetail.metadata.name;
      if (userDetail.spec.groups) {
        for (let indx = 0; indx < userDetail.spec.groups.length; indx++) {
          let group = groupsList.filter(function (ele) {
            return ele.metadata.name === userDetail.spec.groups[indx];
          });
          newState.selectedList.push(...group);
        }
      }
    }
    if (groupsList && groupsList.length > 0) {
      newState.availableGroups = groupsList;
    } else {
      newState.availableGroups = [];
    }
    if (isGroupDeleteError) {
      newState.alertMessage = error;
      newState.alertOpen = true;
    }
    return {
      ...newState,
    };
  }

  componentWillUnmount() {
    const { history, resetUserGroupDeleteError } = this.props;
    resetUserGroupDeleteError();
  }

  handleResponseErrorClose = () => {
    const { resetUserGroupDeleteError } = this.props;
    resetUserGroupDeleteError();
    this.setState({ alertOpen: false, alertMessage: null });
  };

  handleAdded = (add) => {
    this.setState({ addUsersList: add });
  };

  handleRemoved = (rem) => {
    this.setState({ removeUsersList: rem });
  };

  addUserSuccessCallback = () => {
    const { history } = this.props;
    const { userId } = this.state;
    history.push(`/main/users/${userId}`);
  };

  arrayRemove = (arr, value) => {
    return arr.filter(function (ele) {
      return ele != value;
    });
  };

  handleSaveChanges = () => {
    const { addUsersList, removeUsersList, userId } = this.state;
    const { userDetail, editUser } = this.props;
    if (addUsersList.length) {
      if (!userDetail.spec.groups) {
        userDetail.spec.groups = [];
      }
      for (let indx = 0; indx < addUsersList.length; indx++) {
        userDetail.spec.groups.push(addUsersList[indx].metadata.name);
      }
      editUser(userDetail);
    }
    if (removeUsersList.length) {
      for (let index = 0; index < removeUsersList.length; index++) {
        userDetail.spec.groups = this.arrayRemove(
          userDetail.spec.groups,
          removeUsersList[index].metadata.name
        );
      }
      editUser(userDetail);
    }
    this.addUserSuccessCallback();
  };

  render() {
    const {
      availableGroups,
      username,
      userId,
      alertOpen,
      alertMessage,
      userDetail,
      selectedList,
    } = this.state;
    const config = {
      links: [
        {
          label: `Users`,
          href: "#/main/users",
        },
        {
          label: `${username}`,
          href: `#/main/users/${userId}`,
        },
        {
          label: <T.span text="users.add_to_group.layout.title" />,
          current: true,
        },
      ],
    };

    return (
      <>
        <div className="m-4">
          <RafayPageHeader
            breadcrumb={<ResourceBreadCrumb config={config} />}
            title="users.add_to_group.layout.title"
            help="users.add_to_group.layout.helptext"
          />
          <TransferList
            selectedList={selectedList}
            availableList={availableGroups}
            handleAdded={this.handleAdded}
            handleRemoved={this.handleRemoved}
          />
        </div>
        <Paper
          elevation={3}
          className="workload-detail-bottom-navigation"
          style={{ left: "26px" }}
        >
          <div className="row d-flex justify-content-between pt-3">
            <div className="d-flex flex-row">
              <div className="d-flex align-items-center">
                <Button
                  className="ml-0 bg-white text-red"
                  variant="contained"
                  color="default"
                  onClick={this.addUserSuccessCallback}
                  type="submit"
                >
                  Discard Changes &amp; Exit
                </Button>
              </div>
            </div>
            <div className="next d-flex align-items-center">
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSaveChanges}
                type="submit"
              >
                <span>Save &amp; Exit</span>
              </Button>
            </div>
          </div>
        </Paper>
        <RafaySnackbar
          open={alertOpen}
          severity="error"
          message={alertMessage}
          closeCallback={this.handleResponseErrorClose}
        />
      </>
    );
  }
}

const mapStateToProps = ({ Groups, Users, settings }) => {
  const { userDetail, isGroupDeleteError, error } = Users;
  const { groupsList } = Groups;
  const { drawerType } = settings;
  return {
    groupsList,
    userDetail,
    drawerType,
    isGroupDeleteError,
    error,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    editUser,
    getUser,
    getGroups,
    resetUserGroupDeleteError,
  })(AddToGroups)
);

/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getGroupDetail,
  editGroupWithCallback,
  getUsers,
  resetGroupUsers,
} from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ResourceBreadCrumb from "components/ResourceBreadCrumb";
import AppSnackbar from "components/AppSnackbar";
import PageHeader from "components/PageHeader";
import TransferList from "./ProjectTransferList/index";
import { capitalizeFirstLetter } from "../../../../../utils";

class AddUsers extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      list: [],
      groupId: props.match.params.groupId,
      groupName: "",
      addUsersList: [],
      removeUsersList: [],
    };
  }

  componentDidMount() {
    const { getGroupDetail, getUsers, match } = this.props;
    getUsers();
    getGroupDetail(match.params.groupId);
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { groupDetail, orgUsersList, resetGroupUsers } = props;
    if (groupDetail && orgUsersList) {
      newState.groupName = groupDetail.metadata.name;
      if (groupDetail.spec.users) {
        for (let indx = 0; indx < groupDetail.spec.users.length; indx++) {
          let user = orgUsersList.filter(function (ele) {
            return ele.metadata.name === groupDetail.spec.users[indx];
          });
          newState.list.push(...user);
        }
      }
    }

    if (props.isUpdateGroupError) {
      newState.deleteError = props.error.details[0].detail;
      newState.showError = true;
      resetGroupUsers();
    }
    return {
      ...newState,
    };
  }

  handleCreateClose = () => {
    this.setState({
      open: false,
    });
  };

  handleCreate = () => {
    const { addUsersList, groupDetail } = this.state;
    const { editGroupWithCallback } = this.props;
    this.handleCreateClose();
    if (groupDetail.spec.users) {
      groupDetail.spec.users.push(...addUsersList);
    } else {
      groupDetail.spec.users = addUsersList;
    }
    editGroupWithCallback(groupDetail, this.addUserSuccessCallback);
  };

  handleResourceChange = (id, index) => (event) => {
    const { addUsersList } = this.state;
    addUsersList[index] = { id: event.target.value };
    this.setState({
      addUsersList,
    });
  };

  handleUserAddMore = (event) => {
    let { addUsersList } = this.state;
    addUsersList = [...addUsersList, { id: "" }];
    this.setState({
      addUsersList,
    });
  };

  handleUserRemove = (index) => (event) => {
    const { addUsersList } = this.state;
    addUsersList.splice(index, 1);
    this.setState({
      addUsersList,
    });
  };

  handleRemoveGroup = (groupId, accountId) => {
    const { removeGroupUser } = this.props;
    const deleteInitiated = true;
    this.setState({ deleteInitiated }, removeGroupUser(groupId, accountId));
  };

  handleResponseErrorClose = () => {
    this.setState({ showError: false, deleteError: null });
  };

  handleAdded = (add) => {
    this.setState({ addUsersList: add });
  };

  handleRemoved = (rem) => {
    this.setState({ removeUsersList: rem });
  };

  addUserSuccessCallback = () => {
    const { history } = this.props;
    const { groupId } = this.state;
    history.push(`/main/groups/${groupId}`);
  };

  arrayRemove = (arr, value) => {
    return arr.filter(function (ele) {
      return ele != value;
    });
  };

  handleSaveChanges = () => {
    const { addUsersList, removeUsersList, groupId } = this.state;
    const { groupDetail, addUsersToGroup, editGroupWithCallback } = this.props;
    if (addUsersList.length) {
      if (!groupDetail.spec.users) {
        groupDetail.spec.users = [];
      }
      addUsersList.forEach((user) => {
        groupDetail.spec.users.push(user.metadata.name);
      });
    }
    if (removeUsersList.length) {
      removeUsersList.forEach((user) => {
        groupDetail.spec.users = this.arrayRemove(
          groupDetail.spec.users,
          user.metadata.name,
        );
      });
    }
    groupDetail.spec.users = [...new Set(groupDetail.spec.users)];
    editGroupWithCallback(groupDetail, this.addUserSuccessCallback);
  };

  render() {
    let groupUsersList = [];
    const { list, groupName, groupId, showError, deleteError } = this.state;
    const { orgUsersList, drawerType } = this.props;
    if (list) {
      groupUsersList = list;
    }
    let allUsersList = [];
    if (orgUsersList) {
      allUsersList = orgUsersList;
    }
    const config = {
      links: [
        {
          label: `Groups`,
          href: "#/main/groups",
        },
        {
          label: `${groupName}`,
          href: `#/main/groups/${groupId}`,
        },
        {
          label: "Add/Remove Members",
          current: true,
        },
      ],
    };

    return (
      <>
        <div className="m-4">
          <PageHeader
            breadcrumb={<ResourceBreadCrumb config={config} />}
            title="groups.add_users.layout.title"
            help="groups.add_users.layout.helptext"
          />
          <TransferList
            selectedList={groupUsersList}
            availableList={allUsersList}
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
        <AppSnackbar
          open={showError}
          severity="error"
          message={capitalizeFirstLetter(deleteError)}
          closeCallback={this.handleResponseErrorClose}
        />
      </>
    );
  }
}

const mapStateToProps = ({ Groups, settings }) => {
  const { groupDetail, isUpdateGroupError, error } = Groups;
  const { drawerType } = settings;
  const orgUsersList = settings.users.list;
  return {
    groupDetail,
    orgUsersList,
    isUpdateGroupError,
    error,
    drawerType,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getGroupDetail,
    editGroupWithCallback,
    getUsers,
    resetGroupUsers,
  })(AddUsers),
);

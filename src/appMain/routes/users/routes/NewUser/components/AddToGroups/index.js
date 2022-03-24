/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  addGroupsToUser,
  removeGroupsFromUser,
  getGroups,
  resetGroupUsers,
} from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import RafaySnackbar from "components/RafaySnackbar";
import TransferList from "./RafayTransferList/index";
import SelectGroupList from "./RafayTransferList/SelectGroupList";

class AddToGroups extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      user: props.user,
      list: [],
      userId: props.user.metadata.id,
      username: props.user.metadata.name,
      addUsersList: [],
      removeUsersList: [],
      availableGroups: [],
    };
  }

  componentDidMount() {
    const { getGroups } = this.props;
    getGroups();
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { groupsList } = props;
    if (groupsList && groupsList.length > 0) {
      newState.availableGroups = groupsList;
    } else {
      newState.availableGroups = [];
    }
    return {
      ...newState,
    };
  }

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
    history.push(`/main/users`);
  };

  handleSaveChanges = () => {
    const { addUsersList, removeUsersList, userId } = this.state;
    const { addGroupsToUser, removeGroupsFromUser } = this.props;
    if (addUsersList.length) {
      addGroupsToUser(userId, addUsersList, this.addUserSuccessCallback);
    }
    if (removeUsersList.length) {
      removeGroupsFromUser(
        userId,
        removeUsersList,
        this.addUserSuccessCallback
      );
    }
  };

  render() {
    const { availableGroups, showError, deleteError } = this.state;
    const { drawerType } = this.props;

    return (
      <>
        <div className="">
          {/* <TransferList
            selectedList={[]}
            availableList={availableGroups}
            handleAdded={this.handleAdded}
            handleRemoved={this.handleRemoved}
          /> */}
          <SelectGroupList
            selectedList={[]}
            availableList={availableGroups}
            handleAdded={this.handleAdded}
            handleRemoved={this.handleRemoved}
          />
        </div>

        <RafaySnackbar
          open={showError}
          severity="error"
          message={deleteError}
          closeCallback={this.handleResponseErrorClose}
        />
      </>
    );
  }
}

const mapStateToProps = ({ Groups, Users, settings }) => {
  const { userGroups, userDetail } = Users;
  const { groupsList } = Groups;
  const { drawerType } = settings;
  return {
    groupsList,
    userGroups,
    userDetail,
    drawerType,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    addGroupsToUser,
    removeGroupsFromUser,
    getGroups,
    resetGroupUsers,
  })(AddToGroups)
);

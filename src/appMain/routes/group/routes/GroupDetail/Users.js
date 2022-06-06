import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getGroupDetail, updateGroup, resetGroupUsers } from "actions/index";
import T from "i18n-react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import AppSnackbar from "components/AppSnackbar";
import InfoCardComponent from "components/InfoCardComponent";
import DataTableToolbar from "components/TableComponents/DataTableToolbar";
import DataTable from "components/TableComponents/DataTable";
import { capitalizeFirstLetter } from "../../../../../utils";

class Users extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      list: [],
      groupId: props.match.params.groupId,
      groupName: "",
      addUsersList: [],
      isDefaultUsersGroup: false,
    };
  }

  componentDidMount() {
    const { getGroupDetail, match } = this.props;
    getGroupDetail(match.params.groupId);
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { groupDetail, resetGroupUsers } = props;
    if (groupDetail) {
      newState.isDefaultUsersGroup = groupDetail.spec.type === "DEFAULT_USERS";
      newState.groupName = groupDetail.metadata.name;
      if (groupDetail.spec.users) {
        newState.list = groupDetail.spec.users;
      }
    }
    if (props.isUpdateGroupError) {
      newState.alertMessage = props.error.message;
      newState.alertOpen = true;
      newState.alertSeverity = "error";
      resetGroupUsers();
    }
    if (props.isAddUsersSuccess) {
      newState.alertMessage = "Add user successful";
      newState.alertOpen = true;
      newState.alertSeverity = "success";
      resetGroupUsers();
    }
    return {
      ...newState,
    };
  }

  handleCreateClick = () => {
    const { groupId } = this.state;
    const { history } = this.props;
    history.push(`/main/groups/${groupId}/addusers`);
  };

  arrayRemove = (arr, value) => {
    return arr.filter(function (ele) {
      return ele != value;
    });
  };

  handleRemoveGroupUser = (account) => {
    const { groupDetail, updateGroup } = this.props;
    const deleteInitiated = true;
    groupDetail.spec.users = this.arrayRemove(groupDetail.spec.users, account);
    this.setState({ deleteInitiated }, updateGroup(groupDetail));
  };

  handleResponseErrorClose = () => {
    this.setState({ alertOpen: false, alertMessage: null });
  };

  parseRowData = (data) => {
    const { groupId, isDefaultUsersGroup } = this.state;
    const confirmText = (
      <span>
        <span>Are you sure you want to delete </span>
        <span style={{ fontWeight: 500, fontSize: "16px" }}>{data}</span>
        <span> from the group ?</span>
      </span>
    );
    return [
      {
        type: "regular",
        value: data,
      },
      {
        type: "buttons",
        buttons: [
          {
            type: "danger-icon",
            label: "Remove",
            confirmText,
            disabled: isDefaultUsersGroup,
            handleClick: () => {
              this.handleRemoveGroupUser(data);
            },
          },
        ],
      },
    ];
  };

  render() {
    const {
      list,
      open,
      addUsersList,
      groupName,
      groupId,
      alertOpen,
      alertMessage,
      alertSeverity,
      isDefaultUsersGroup,
    } = this.state;
    const AddUsersButton = (
      <Button
        variant="contained"
        className="jr-btn jr-btn-label left text-nowrap text-white ml-2 mt-2"
        onClick={this.handleCreateClick}
        style={{ marginRight: 8 }}
        color="primary"
        id="new_group"
        disabled={isDefaultUsersGroup}
      >
        <span>Add/Remove Members</span>
      </Button>
    );
    if (list && !list.length) {
      return (
        <InfoCardComponent
          title={<T.span text="groups.group_detail.no_users.title" />}
          linkHelper={<T.span text="groups.group_detail.no_users.helptext" />}
          link={AddUsersButton}
        />
      );
    }

    const columnLabels = [
      {
        label: "User",
      },
      {
        label: "",
      },
    ];

    return (
      <div className="">
        <Paper>
          <DataTableToolbar button={AddUsersButton} />
          <DataTable
            columnLabels={columnLabels}
            list={list || []}
            parseRowData={this.parseRowData}
          />
        </Paper>
        <AppSnackbar
          open={alertOpen}
          message={capitalizeFirstLetter(alertMessage)}
          severity={alertSeverity}
          closeCallback={this.handleResponseErrorClose}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ Groups, Users }) => {
  const { groupDetail, isUpdateGroupError, error } = Groups;
  return {
    groupDetail,
    isUpdateGroupError,
    error,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getGroupDetail,
    updateGroup,
    resetGroupUsers,
  })(Users)
);

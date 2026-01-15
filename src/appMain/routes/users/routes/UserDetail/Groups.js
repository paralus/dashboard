import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getUserDetail,
  editUser,
  getGroups,
  resetUserGroupDeleteError,
} from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import T from "i18n-react";
import DataTableToolbar from "components/TableComponents/DataTableToolbar";
import DataTable from "components/TableComponents/DataTable";
import AppSnackbar from "components/AppSnackbar";
import InfoCardComponent from "components/InfoCardComponent";
import { capitalizeFirstLetter } from "../../../../../utils";

const style = {
  nameLabel: {
    fontWeight: "500",
  },
  nameLabelDescription: {
    fontSize: "0.65rem",
  },
};

class Groups extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      userId: props.match.params.userId,
      alertMessage: "",
      alertOpen: false,
      alertSeverity: "error",
    };
  }

  componentDidMount() {
    const { getGroups } = this.props;
    const { getUserDetail } = this.props;
    const { userId } = this.state;
    getUserDetail(userId);
    getGroups();
  }

  static getDerivedStateFromProps(props, state) {
    const { groupsList, isGroupDeleteError, error } = props;
    const newState = { ...state };
    if (isGroupDeleteError) {
      newState.alertMessage = error;
      newState.alertOpen = true;
    }
    return {
      ...newState,
    };
  }

  componentWillUnmount() {
    const { resetUserGroupDeleteError } = this.props;
    resetUserGroupDeleteError();
  }

  handleResponseErrorClose = () => {
    const { resetUserGroupDeleteError } = this.props;
    resetUserGroupDeleteError();
    this.setState({
      alertMessage: "",
      alertOpen: false,
    });
  };

  handleCreateClick = () => {
    const { history } = this.props;
    const { userId } = this.state;
    history.push(`/main/users/${userId}/addtogroups`);
  };

  handleDeleteGroup = (group) => {
    const { userDetail } = this.props;
    const { editUser } = this.props;
    userDetail.spec.groups = this.arrayRemove(userDetail.spec.groups, group);
    userDetail.spec.projectNamespaceRoles = this.pnrGroupRemove(
      userDetail.spec.projectNamespaceRoles,
      group,
    );
    editUser(userDetail);
  };

  pnrGroupRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele.group != value;
    });
  }

  arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  getGroupDetail(name) {
    if (this.props.groupsList && this.props.groupsList.length > 0) {
      for (let indx = 0; indx < this.props.groupsList.length; indx++) {
        if (this.props.groupsList[indx].metadata.name === name) {
          return this.props.groupsList[indx];
        }
      }
    }
    return;
  }

  parseRowData = (data) => {
    const getName = (data) => {
      let groupDetail = this.getGroupDetail(data);
      if (groupDetail.spec.type === "DEFAULT_USERS") {
        return (
          <>
            <div style={style.nameLabel}>{data}</div>
            <div className="text-muted" style={style.nameLabelDescription}>
              Default group for all local users
            </div>
          </>
        );
      }
      if (groupDetail.spec.type === "DEFAULT_ADMINS") {
        return (
          <>
            <div style={style.nameLabel}>{data}</div>
            <div className="text-muted" style={style.nameLabelDescription}>
              Default group for all Organization Admins
            </div>
          </>
        );
      }
      if (groupDetail.spec.type === "DEFAULT_READONLY_ADMINS") {
        return (
          <>
            <div style={style.nameLabel}>{data}</div>
            <div className="text-muted" style={style.nameLabelDescription}>
              Default group for all Organization Read Only
            </div>
          </>
        );
      }
      return data;
    };
    const confirmText = (
      <span>
        <span>Are you sure you want to delete the user from group </span>
        <span style={{ fontWeight: 500, fontSize: "16px" }}>{data}</span>
        <span> ?</span>
      </span>
    );
    return [
      {
        type: "regular",
        value: getName(data),
      },
      {
        type: "buttons",
        buttons: [
          {
            type: "danger-icon",
            label: "Delete",
            confirmText,
            disabled: this.getGroupDetail(data).spec.type === "DEFAULT_USERS",
            handleClick: () => this.handleDeleteGroup(data),
          },
        ],
      },
    ];
  };

  render() {
    const { userDetail } = this.props;
    const { alertOpen, alertMessage, alertSeverity } = this.state;

    const ManageMembershipButton = (
      <Button
        variant="contained"
        className="jr-btn jr-btn-label left text-nowrap text-white"
        onClick={this.handleCreateClick}
        style={{ marginRight: 8 }}
        color="primary"
        id="add_to_group"
      >
        <span>Manage Membership</span>
      </Button>
    );

    if (!userDetail.spec?.groups?.length) {
      return (
        <>
          <InfoCardComponent
            title={<T.span text="users.user_detail.no_groups.title" />}
            linkHelper={<T.span text="users.user_detail.no_groups.helptext" />}
            link={ManageMembershipButton}
          />
        </>
      );
    }

    const columnLabels = [
      {
        label: "Group",
      },
      {
        label: "",
      },
    ];

    return (
      <div className="">
        <Paper>
          <DataTableToolbar button={ManageMembershipButton} />
          <DataTable
            columnLabels={columnLabels}
            list={userDetail.spec.groups}
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

const mapStateToProps = ({ Users, Groups }) => {
  const { groupsList } = Groups;
  const { userDetail, error, isGroupDeleteError } = Users;
  return {
    userDetail,
    groupsList,
    error,
    isGroupDeleteError,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getGroups,
    getUserDetail,
    editUser,
    resetUserGroupDeleteError,
  })(Groups),
);

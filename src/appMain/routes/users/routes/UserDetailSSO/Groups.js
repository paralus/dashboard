import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getUserDetail,
  editUser,
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
    const { getUserDetail } = this.props;
    const { userId } = this.state;
    getUserDetail(userId);
  }

  static getDerivedStateFromProps(props, state) {
    const { isGroupDeleteError, error } = props;
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
    const { history, resetUserGroupDeleteError } = this.props;
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
    const { userId } = this.state;
    const { removeGroupsFromUser, getUserGroups } = this.props;
    removeGroupsFromUser(userId, [group], () => getUserGroups(userId));
  };

  parseRowData = (data) => {
    const getName = (data) => {
      if (data.type === "DEFAULT_USERS") {
        return (
          <>
            <div style={style.nameLabel}>{data.name}</div>
            <div className="text-muted" style={style.nameLabelDescription}>
              Default group for all local users
            </div>
          </>
        );
      }
      if (data.type === "DEFAULT_ADMINS") {
        return (
          <>
            <div style={style.nameLabel}>{data.name}</div>
            <div className="text-muted" style={style.nameLabelDescription}>
              Default group for all Organization Admins
            </div>
          </>
        );
      }
      if (data.type === "DEFAULT_READONLY_ADMINS") {
        return (
          <>
            <div style={style.nameLabel}>{data.name}</div>
            <div className="text-muted" style={style.nameLabelDescription}>
              Default group for all Organization Read Only
            </div>
          </>
        );
      }
      return data.name;
    };
    const confirmText = (
      <span>
        Are you sure you want to delete the user from group
        <b> {data.name} </b>?
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
            disabled: data.type === "DEFAULT_USERS",
            handleClick: () => this.handleDeleteGroup(data),
          },
        ],
      },
    ];
  };

  render() {
    const { userGroups } = this.props;
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

    if (!userGroups.length) {
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
            list={userGroups}
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

const mapStateToProps = ({ Users }) => {
  const { userGroups, error, isGroupDeleteError } = Users;
  return {
    userDetail,
    error,
    isGroupDeleteError,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getUserDetail,
    editUser,
    resetUserGroupDeleteError,
  })(Groups),
);

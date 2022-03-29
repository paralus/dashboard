import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getGroups,
  createGroup,
  updateGroup,
  removeGroup,
  resetGroup,
  resetGroupList,
} from "actions";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import { ValidatorForm } from "react-material-ui-form-validator";
import ResourceListTable from "./components/ResourceListTable";
import CreateResourceDialog from "./components/CreateResourceDialog";

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
      open: false,
      list: [],
      group: {
        metadata: {
          name: "",
          description: "",
        },
        spec: {
          type: "SYSTEM",
        },
      },
    };
  }

  componentDidMount() {
    ValidatorForm.addValidationRule("regex", (value) => {
      const regex = /^[a-zA-Z]([-a-zA-Z0-9]*[a-zA-Z0-9])?$/;

      return regex.test(value);
    });
    ValidatorForm.addValidationRule("lowercaseonly", (value) => {
      const regex = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

      return regex.test(value);
    });
    const { getGroups } = this.props;
    getGroups();
  }

  static getDerivedStateFromProps(props, state) {
    const newState = { ...state };
    const { history, resetGroup, groupsList, isCreateSuccess, newGroup } =
      props;
    if (isCreateSuccess && newGroup) {
      resetGroup();
      history.push(`/main/groups/${newGroup.id}`);
    }
    if (groupsList && groupsList.length > 0) {
      newState.list = groupsList;
    } else {
      newState.list = [];
    }

    if (props.isDeleteFailed && newState.deleteInitiated) {
      newState.deleteInitiated = false;
      newState.deleteError = props.error.message;
      newState.showError = true;
      resetGroup();
    }
    if (props.isUpdateGroupError) {
      newState.deleteError = props.error.message;
      newState.showError = true;
      resetGroup();
    }
    if (props.createGroupError) {
      newState.deleteError = props.error.message;
      newState.showError = true;
      resetGroup();
    }
    return newState;
  }

  componentWillUnmount() {
    const { resetGroupList } = this.props;
    resetGroupList();
  }

  handleCreateClick = () => {
    this.setState({
      open: true,
    });
  };

  handleCreateClose = () => {
    this.setState({
      open: false,
    });
  };

  handleCreate = () => {
    const { group } = this.state;
    const { createGroup } = this.props;
    this.handleCreateClose();
    createGroup(group);
  };

  handleResourceChange = (name) => (event) => {
    const { group } = this.state;
    if (name === "name") {
      group.metadata.name = event.target.value;
    }
    if (name === "description") {
      group.metadata.description = event.target.value;
    }
    this.setState({
      group: {
        ...group,
      },
    });
  };

  handleRemoveGroup = (id) => {
    const { removeGroup } = this.props;
    const deleteInitiated = true;
    this.setState({ deleteInitiated }, removeGroup(id));
  };

  handleResponseErrorClose = () => {
    this.setState({ showError: false, deleteError: null });
  };

  handleGoToManageUsers = (event, n) => {
    const { history } = this.props;
    history.push(`/main/groups/${n.metadata.name}`);
  };

  render() {
    let data = [];
    const { list, open, group, showError, deleteError } = this.state;
    const { history } = this.props;
    if (list) {
      data = list;
    }

    return (
      <div className="app-wrapper">
        <div>
          <h1
            className="p-0"
            style={{ marginBottom: "20px", color: "#ff9800" }}
          >
            Groups
          </h1>
          {data.length === 0 ? (
            <p style={style.helpText} className="pt-0">
              No gruops available at this time
            </p>
          ) : (
            <p style={style.helpText} className="pt-0">
              Your groups are listed below
            </p>
          )}

          <ResourceListTable
            handleCreateClick={this.handleCreateClick}
            handleRemoveGroup={this.handleRemoveGroup}
            list={list}
            history={history}
            handleGoToManageUsers={this.handleGoToManageUsers}
          />
        </div>
        <CreateResourceDialog
          handleCreate={this.handleCreate}
          handleCreateClose={this.handleCreateClose}
          handleResourceChange={this.handleResourceChange}
          open={open}
          resource={group}
        />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={showError}
          onClose={this.handleResponseErrorClose}
          SnackbarContentProps={{
            "aria-describedby": "message-id",
          }}
          className="mb-3"
          message={deleteError}
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

const mapStateToProps = ({ Groups }) => {
  const {
    groupsList,
    isCreateSuccess,
    isDeleteSuccess,
    isDeleteFailed,
    isUpdateGroupError,
    error,
    createGroupError,
    newGroup,
  } = Groups;
  return {
    groupsList,
    isCreateSuccess,
    isDeleteSuccess,
    isDeleteFailed,
    isUpdateGroupError,
    error,
    createGroupError,
    newGroup,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getGroups,
    createGroup,
    updateGroup,
    removeGroup,
    resetGroup,
    resetGroupList,
  })(List)
);

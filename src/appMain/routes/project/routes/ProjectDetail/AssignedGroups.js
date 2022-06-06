import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getProject,
  resetProjectError,
  editProjectWithCallback,
} from "actions/index";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import T from "i18n-react";
import AppSnackbar from "components/AppSnackbar";
import DataTableToolbar from "components/TableComponents/DataTableToolbar";
import DataTable from "components/TableComponents/DataTable";
import InfoCardComponent from "components/InfoCardComponent";
import RolesInfo from "components/RolesInfo";
import { capitalizeFirstLetter } from "../../../../../utils";

class AssignedGroups extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      projectId: props.match.params.projectId,
      projGroups: [],
    };
  }

  componentDidMount() {
    const { getProject } = this.props;
    const { projectId } = this.state;
    getProject(projectId);
  }

  static getDerivedStateFromProps(props, state) {
    const { isAddUserError, error, resetProjectError, projectDetail } = props;
    if (projectDetail && projectDetail.spec.projectNamespaceRoles) {
      state.projGroups = projectDetail.spec.projectNamespaceRoles.filter(
        (pnr) => pnr.group && pnr.group.length > 0
      );
    }
    if (isAddUserError) {
      resetProjectError();
      return {
        ...state,
        deleteError: error.details[0].detail,
        showError: true,
      };
    }
    return state;
  }

  handleCreateClick = () => {
    const { history } = this.props;
    const { projectId } = this.state;
    history.push(`/main/projects/${projectId}/assigngroup`);
  };

  handleResponseErrorClose = () => {
    this.setState({ showError: false, deleteError: null });
  };

  successCallback = () => {
    // const { history } = this.props;
    // const { userId } = this.state;
    // history.push(`/main/users/${userId}`);
    const { getProject } = this.props;
    const { projectId } = this.state;
    getProject(projectId);
  };

  errorCallback = (error) => {
    this.setState({
      showError: true,
      deleteError: error.details[0].detail,
    });
  };

  handleDeleteProject = (data) => {
    const { editProjectWithCallback } = this.props;
    const { roles } = data;
    const { group, project } = roles[0];
    const params = {
      project,
      roles,
    };
    editProjectWithCallback(params, this.successCallback, this.errorCallback);
  };

  handleChangeRoles = (data) => {
    const { history } = this.props;
    const { projectId } = this.state;
    history.push(`/main/projects/${projectId}/groups/${data.group}`);
  };

  parseRowData = (data) => {
    const { UserSession } = this.props;
    const { projectId } = this.state;
    const confirmText = (
      <span>
        <span>Are you sure you want to unassign </span>
        <span style={{ fontWeight: 500, fontSize: "16px" }}>{data.group}</span>
        <span> from the project ?</span>
      </span>
    );
    return [
      {
        type: "regular",
        value: data.group,
      },
      {
        type: "regular",
        value: <RolesInfo roles={data?.roles} projectId={projectId} />,
      },
      {
        type: "buttons",
        buttons: [
          {
            type: "edit-icon",
            label: "Change Roles",
            disabled: !UserSession.visibleAdmin,
            handleClick: () => this.handleChangeRoles(data),
          },
          {
            type: "danger-icon",
            label: "Delete",
            confirmText,
            disabled: !UserSession.visibleAdmin,
            handleClick: () => this.handleDeleteProject(data),
          },
        ],
      },
    ];
  };

  render() {
    const { projGroups, showError, deleteError } = this.state;
    const { UserSession } = this.props;

    const AddToProjectButton = (
      <Button
        variant="contained"
        className="jr-btn jr-btn-label left text-nowrap text-white ml-2 mt-2"
        onClick={this.handleCreateClick}
        style={{ marginRight: 8 }}
        disabled={!UserSession.visibleAdmin}
        color="primary"
        id="assign_group"
      >
        <span>Assign Group To Project</span>
      </Button>
    );

    if (!projGroups.length) {
      return (
        <>
          <InfoCardComponent
            title={<T.span text="projects.project_detail.no_groups.title" />}
            linkHelper={
              <T.span text="projects.project_detail.no_groups.helptext" />
            }
            link={AddToProjectButton}
          />
        </>
      );
    }

    const tableData = [];
    for (let index = 0; index < projGroups.length; index++) {
      const element = projGroups[index];
      let found = null;
      found = tableData.find((d) => d.group === element.group);

      if (found) {
        const roles = new Set(found.roles);
        roles.add(element.role);
        found.roles = [...roles];
      } else {
        tableData.push({
          group: element.group,
          roles: [element.role],
        });
      }
    }

    const columnLabels = [
      {
        label: "Group",
      },
      {
        label: "Roles",
      },
      {
        label: "",
      },
    ];

    return (
      <div className="">
        <Paper>
          <DataTableToolbar button={AddToProjectButton} />
          <DataTable
            columnLabels={columnLabels}
            list={tableData}
            parseRowData={this.parseRowData}
          />
        </Paper>
        <AppSnackbar
          open={showError}
          message={capitalizeFirstLetter(deleteError)}
          closeCallback={this.handleResponseErrorClose}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ Projects, UserSession }) => {
  const { projectDetail } = Projects;
  return {
    projectDetail,
    UserSession,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    getProject,
    resetProjectError,
    editProjectWithCallback,
  })(AssignedGroups)
);

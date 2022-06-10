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
import RafaySnackbar from "components/RafaySnackbar";
import DataTableToolbar from "components/RafayTable/DataTableToolbar";
import DataTable from "components/RafayTable/DataTable";
import RafayInfoCard from "components/RafayInfoCard";
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
        value: (
          <RolesInfo
            roles={data?.roles}
            projectId={projectId}
            roleInfo={data?.roleInfo}
          />
        ),
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

  processGroupsWithNamespaces = (data) => {
    let processed = [];
    const firstElement = data[0];

    // pushing 1 project-role element into output array
    processed.push({
      project: firstElement.project,
      role: firstElement.role,
      group: firstElement.group,
      namespaces: firstElement.namespace ? [firstElement.namespace] : [],
    });

    // remove 1st element from data array
    data = data.filter((element) => element !== firstElement);

    if (data.length > 0) {
      data.forEach((e) => {
        let similarElement = processed.find(
          (element) =>
            element.project === e.project &&
            element.group === e.group &&
            element.role === e.role
        );
        if (!similarElement) {
          processed.push({
            project: e.project,
            role: e.role,
            group: e?.group,
            namespaces: e.namespace ? [e.namespace] : [],
          });
        } else {
          const SimilarElementIndex = processed.findIndex((object) => {
            return (
              object.project === similarElement.project &&
              object.role === similarElement.role &&
              object.group === similarElement.group
            );
          });
          similarElement.namespaces.push(e.namespace);
          processed[SimilarElementIndex] = similarElement;
        }
      });
    }
    return processed;
  };

  processGroupsWithRoles = (data) => {
    let processed = [];

    // pushing 1 project-role element into processed array
    processed.push({
      project: data[0]?.project,
      group: data[0]?.group,
      roleInfo: [{ roleName: data[0].role, namespaces: data[0].namespaces }],
    });

    // remove 1st element from data array
    data.shift();

    if (data.length > 0) {
      data.forEach((e) => {
        let similarElement = processed.find(
          (element) =>
            element.project === e.project && element.group === e.group
        );
        if (!similarElement) {
          processed.push({
            project: e.project,
            group: e?.group,
            roleInfo: [{ roleName: e.role, namespaces: e.namespaces }],
          });
        } else {
          const SimilarElementIndex = processed.findIndex((object) => {
            return object.project === similarElement.project;
          });
          similarElement.roleInfo.push({
            roleName: e.role,
            namespaces: e.namespaces,
          });
          processed[SimilarElementIndex] = similarElement;
        }
      });
    }
    return processed;
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
          <RafayInfoCard
            title={<T.span text="projects.project_detail.no_groups.title" />}
            linkHelper={
              <T.span text="projects.project_detail.no_groups.helptext" />
            }
            link={AddToProjectButton}
          />
        </>
      );
    }

    let tableData = [];
    if (projGroups && projGroups.length > 0) {
      tableData = this.processGroupsWithNamespaces(projGroups);

      if (tableData.length > 0)
        tableData = this.processGroupsWithRoles(tableData);
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
        <RafaySnackbar
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

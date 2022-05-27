import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getProjects, createProject, deleteProject } from "actions/index";
import { ValidatorForm } from "react-material-ui-form-validator";
import RafaySnackbar from "components/RafaySnackbar";
import ProjectsTable from "./components/ProjectsTable";
import CreateProjectDialog from "./components/CreateProjectDialog";
import { capitalizeFirstLetter } from "../../../../../utils";

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

class Project extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      list: [],
      project: {
        name: "",
        description: "",
      },
    };
  }

  UNSAFE_componentWillMount() {
    ValidatorForm.addValidationRule("regex", (value) => {
      const regex = /^[a-zA-Z]([-a-zA-Z0-9]*[a-zA-Z0-9])?$/;

      return regex.test(value);
    });
  }

  componentDidMount() {
    this.props.getProjects();
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (
      props.projectsList &&
      props.projectsList.count > 0 &&
      props.projectsList.results
    ) {
      this.state.list = props.projectsList.results;
    } else {
      this.state.list = [];
    }
    this.setState({ ...this.state });
  }

  handleCreateClick = () => {
    this.props.getProjects();
  };

  handleCreateClick = () => {
    this.setState({
      project: {
        name: "",
        description: "",
      },
      open: true,
    });
  };

  handleCreateClose = () => {
    this.setState({
      ...this.state,
      open: false,
    });
  };

  successCallback = (_) => {
    this.setState({
      showAlert: true,
      alertMessage: "Project Creation Sucessful",
      alertSeverity: "success",
    });
  };

  errorCallback = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: message,
      alertSeverity: "error",
    });
  };

  handleCreate = () => {
    this.handleCreateClose();
    const { createProject } = this.props;
    const { project } = this.state;
    createProject(project, this.successCallback, this.errorCallback);
  };

  handleProjectChange = (name) => (event) => {
    this.state.project[name] = event.target.value;
    this.setState({ ...this.state });
  };

  handleGoToManageUsers = (event, n) => {
    const { history } = this.props;
    history.push(`/main/projects/${n.id}`);
  };

  deleteSuccessCallback = (_) => {
    this.setState({
      showAlert: true,
      alertMessage: "Project Delete Sucessful",
      alertSeverity: "success",
    });
  };

  deleteErrorCallback = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: message,
      alertSeverity: "error",
    });
  };

  handleDeleteProject = (id) => {
    const { deleteProject } = this.props;
    deleteProject(id, this.deleteSuccessCallback, this.deleteErrorCallback);
  };

  handleResponseErrorClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  render() {
    const { showAlert, alertMessage, alertSeverity, list, project, open } =
      this.state;
    let data = [];
    const { UserSession } = this.props;

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
            Projects
          </h1>
          {data.length === 0 ? (
            <p style={style.helpText} className="pt-0">
              No projects available at this time
            </p>
          ) : (
            <p style={style.helpText} className="pt-0">
              Your projects are listed below
            </p>
          )}

          <ProjectsTable
            {...this.state}
            handleCreateClick={this.handleCreateClick}
            handleGoToManageUsers={this.handleGoToManageUsers}
            handleDelete={this.handleDeleteProject}
            list={list}
            session={UserSession}
          />
        </div>
        <CreateProjectDialog
          handleCreate={this.handleCreate}
          handleCreateClose={this.handleCreateClose}
          handleProjectChange={this.handleProjectChange}
          open={open}
          project={project}
        />
        <RafaySnackbar
          open={showAlert}
          severity={alertSeverity}
          message={capitalizeFirstLetter(capitalizeFirstLetter(alertMessage))}
          closeCallback={this.handleResponseErrorClose}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ Projects, UserSession }) => {
  const { projectsList } = Projects;
  return { projectsList, UserSession };
};

export default withRouter(
  connect(mapStateToProps, { getProjects, createProject, deleteProject })(
    Project
  )
);

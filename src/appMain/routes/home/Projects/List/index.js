import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getProjects,
  createProject,
  deleteProject,
  changeProject,
} from "actions/index";
import { Paper } from "@material-ui/core";
import { ValidatorForm } from "react-material-ui-form-validator";
import AppSnackbar from "components/AppSnackbar";
import SearchBoxV2 from "components/SearchBoxV2";
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
      searchText: "",
    };
  }

  UNSAFE_componentWillMount() {
    ValidatorForm.addValidationRule("regex", (value) => {
      const regex = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

      return regex.test(value);
    });
  }

  componentDidMount() {
    this.props.getProjects();
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (
      props.projectsList &&
      props.projectsList.metadata.count > 0 &&
      props.projectsList.items
    ) {
      this.state.list = props.projectsList.items;
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
    const { createProject, settings } = this.props;
    const { project } = this.state;
    createProject(project, this.successCallback, this.errorCallback);
  };

  handleProjectChange = (name) => (event) => {
    this.state.project[name] = event.target.value;
    this.setState({ ...this.state });
  };

  handleGoToManageUsers = (event, n) => {
    const { history } = this.props;
    history.push(`/main/projects/${n.metadata.name}`);
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

  handleDeleteProject = (name) => {
    const { deleteProject } = this.props;
    deleteProject(name, this.deleteSuccessCallback, this.deleteErrorCallback);
  };

  handleResponseErrorClose = () => {
    this.setState({ showAlert: false, alertMessage: null });
  };

  render() {
    const {
      showAlert,
      alertMessage,
      alertSeverity,
      list,
      project,
      open,
      searchText,
    } = this.state;
    let data = [];
    const { UserSession } = this.props;

    if (list) {
      data = list;
    }

    const sortedData = data.sort((a, b) => {
      if (a.metadata.name < b.metadata.name) {
        return -1;
      }
      if (a.metadata.name > b.metadata.name) {
        return 1;
      }
      return 0;
    });

    const filteredData =
      searchText.length > 0
        ? sortedData.filter((d) => d.metadata.name.includes(searchText))
        : sortedData;

    return (
      <div className="">
        {/* <div id="search" className="mt-2 mb-4">
          {this.props.viewSwitcher}
        </div> */}
        <Paper
          id="search"
          className="mt-2 mb-3 d-flex flex-row justify-content-between p-2"
        >
          <div className="col-md-4 p-0">
            <SearchBoxV2
              placeholder="Search ..."
              value={searchText}
              onChange={(e) => this.setState({ searchText: e.target.value })}
            />
          </div>
          <div>{this.props.viewSwitcher}</div>
        </Paper>
        <ProjectsTable
          {...this.state}
          handleCreateClick={this.handleCreateClick}
          handleGoToManageUsers={this.handleGoToManageUsers}
          handleDelete={this.handleDeleteProject}
          changeProject={this.props.changeProject}
          list={filteredData}
          session={UserSession}
          history={this.props.history}
        />
        <CreateProjectDialog
          handleCreate={this.handleCreate}
          handleCreateClose={this.handleCreateClose}
          handleProjectChange={this.handleProjectChange}
          open={open}
          project={project}
        />
        <AppSnackbar
          open={showAlert}
          severity={alertSeverity}
          message={capitalizeFirstLetter(alertMessage)}
          closeCallback={this.handleResponseErrorClose}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ Projects, UserSession, settings }) => {
  const { projectsList } = Projects;
  return { projectsList, UserSession, settings };
};

export default withRouter(
  connect(mapStateToProps, {
    getProjects,
    createProject,
    deleteProject,
    changeProject,
  })(Project)
);

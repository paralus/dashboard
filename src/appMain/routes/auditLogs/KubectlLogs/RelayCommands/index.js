import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getKubectlLogs } from "actions/index";
import LogsDataTable from "../../components/LogsDataTable";

const DefaultFilter = {
  timefrom: "1h",
  queryString: "",
};

class RelayLogs extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      list: [],
      count: 0,
      users: [],
      clusters: [],
      namespaces: [],
      methods: [],
      filter: DefaultFilter,
      auditType: "RelayCommands",
      projects: [],
      isProjectRole: false,
    };
  }

  componentDidMount() {
    this.handleRefreshClick();
  }

  static getDerivedStateFromProps(props, state) {
    const { auditType } = state;
    const logs = props.kubectlLogsList?.[auditType] || {};
    const { hits = {}, aggregations = {} } = logs;

    state.list = hits?.hits || [];
    state.count = hits?.total?.value || hits?.total || state.list.length;

    // Comments by Zahoor
    // Issue: The following lists are derived from response hence on filtering the number of options vary
    // Fix: If aggregated lists have more options then existing list then update the filter options
    const aggregatedUsers = aggregations?.group_by_username?.buckets;
    const aggregatedClusters = aggregations?.group_by_cluster?.buckets;
    const aggregatedNamespaces = aggregations?.group_by_namespace?.buckets;
    const aggregateMethods = aggregations?.group_by_method?.buckets;

    if (aggregatedUsers?.length > state.users?.length)
      state.users = aggregatedUsers;

    if (aggregatedClusters?.length > state.clusters?.length)
      state.clusters = aggregatedClusters;

    if (aggregatedNamespaces?.length > state.namespaces?.length)
      state.namespaces = aggregatedNamespaces;

    if (aggregateMethods?.length > state.methods?.length)
      state.methods = aggregateMethods;

    const items = Array.isArray(props?.projectsList?.items)
      ? props.projectsList.items
      : [];
    const projectList = items.map((p) => ({
      key: p?.metadata?.name,
    }));
    state.projects = projectList;
    state.isProjectRole = props?.UserSession?.userRoles?.projectAuditRead;
    return { ...state };
  }

  handleRefreshClick = (filterProps) => {
    const { filter, auditType, isProjectRole, projects } = this.state;

    const hasProjects = Array.isArray(projects) && projects.length > 0;

    if (isProjectRole) {
      let project = "";

      if (hasProjects) {
        if (filterProps?.project) {
          project = filterProps.project[0];
        } else if (filter?.project) {
          project = filter.project[0];
        } else {
          project = projects[0].key;
        }
      }

      // If no projects, call API WITHOUT project filter
      if (project) {
        this.props.getKubectlLogs(filterProps || filter, auditType, project);
      } else {
        this.props.getKubectlLogs(filterProps || filter, auditType);
      }
    } else {
      this.props.getKubectlLogs(filterProps || filter, auditType);
    }
  };

  handleResetFilter = () => {
    const filter = DefaultFilter;
    this.setState({ filter }, this.handleRefreshClick(filter));
  };

  handleFilter = (event) => {
    const { value, name } = event.target;
    const filter = { ...this.state.filter };
    filter[name] = value;
    if (name === "project") filter[name] = [value];
    if (value === "_ALL_") delete filter[name];
    this.setState({ filter }, this.handleRefreshClick(filter));
  };

  handleRemoveFilter = (filterName) => {
    const filter = { ...this.state.filter };
    delete filter[filterName];
    this.setState({ filter }, this.handleRefreshClick(filter));
  };

  render() {
    const { list, count, users, filter, projects } = this.state;
    const { namespaces, methods, clusters, isProjectAdmin, isProjectRole } =
      this.state;

    return (
      <LogsDataTable
        isRelayCommands
        loading={this.props.loading}
        list={list}
        count={count}
        users={users}
        clusters={clusters}
        namespaces={namespaces}
        methods={methods}
        filter={filter}
        projects={projects}
        isProjectAdmin={isProjectAdmin}
        isProjectRole={isProjectRole}
        handleFilter={this.handleFilter}
        handleResetFilter={this.handleResetFilter}
        handleRefreshClick={() => this.handleRefreshClick(null)}
        handleRemoveFilter={this.handleRemoveFilter}
      />
    );
  }
}

const mapStateToProps = ({ AuditLogs, loading, Projects, UserSession }) => {
  const { kubectlLogsList } = AuditLogs;
  const { projectsList } = Projects;
  return { kubectlLogsList, projectsList, UserSession, loading };
};

export default withRouter(
  connect(mapStateToProps, { getKubectlLogs })(RelayLogs)
);

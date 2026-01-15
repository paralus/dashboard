import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getKubectlLogs } from "actions/index";
import AuditLogsTable from "./components/AuditLogsTable";
import { KUBECTL_DEFAULT_KINDS } from "../Constants";

const DefaultFilter = {
  timefrom: "1h",
  queryString: "",
};

class RelayCommands extends React.Component {
  constructor(props) {
    super(props);
    const { filter: filterProps = {} } = props;
    this.state = {
      list: [],
      count: 0,
      users: [],
      types: [],
      kinds: [],
      projects: [],
      clusters: [],
      filter: { ...DefaultFilter, ...filterProps },
      auditType: "RelayAPI",
      isProjectRole: false,
    };
  }

  componentDidMount() {
    this.handleRefreshClick();
    if (this.props.location.state && this.props.location.state.filter) {
      const { name, value } = this.props.location.state.filter;
      // manually changing filter option
      this.handleFilter({ target: { value, name } });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { auditType } = state;
    const logs = props?.kubectlLogsList?.[auditType] || {};
    const { hits = {}, aggregations = {} } = logs;
    const defaultKinds = KUBECTL_DEFAULT_KINDS.map((kind) =>
      kind.toLowerCase(),
    );

    state.list = hits?.hits || [];
    state.count = hits?.total?.value || hits?.total || state.list.length;

    // Comments by Zahoor
    // Issue: The following lists are derived from response hence on filtering the number of options vary
    // Fix: If aggregated lists have more options then existing list then update the filter options
    const aggregatedUsers = aggregations?.group_by_username?.buckets;
    const aggregatedTypes = aggregations?.group_by_type?.buckets;
    let aggregatedKinds =
      aggregations?.group_by_kind?.buckets?.map((kind) => kind?.key) || [];
    const aggregatedClusters = aggregations?.group_by_cluster?.buckets;
    state.clusters = aggregatedClusters;

    aggregatedKinds = [...new Set([...aggregatedKinds, ...defaultKinds])]
      .sort()
      .map((kind) => {
        return { key: kind };
      });

    if (aggregatedUsers?.length > state.users?.length)
      state.users = aggregatedUsers;

    if (aggregatedTypes?.length > state.types?.length)
      state.types = aggregatedTypes;

    if (aggregatedKinds?.length > state.kinds?.length)
      state.kinds = aggregatedKinds;

    const projectList = props?.projectsList?.items.map((p) => {
      return { key: p?.metadata.name };
    });
    state.projects = projectList || [];

    state.isProjectRole = props?.UserSession?.userRoles?.projectAuditRead;
    return { ...state };
  }

  handleRefreshClick = (filterProps) => {
    const { filter, auditType, isProjectRole, projects } = this.state;
    if (isProjectRole) {
      let project = "";
      if (filterProps) {
        if (filterProps?.project) {
          project = filterProps.project[0];
        } else {
          project = projects[0]["key"];
        }
      } else if (filter.project) {
        project = filter.project[0];
      } else {
        project = projects[0]["key"];
      }
      this.props.getKubectlLogs(filterProps || filter, auditType, project);
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
    const {
      list,
      count,
      users,
      types,
      clusters,
      projects,
      kinds,
      filter,
      isProjectRole,
    } = this.state;
    return (
      <AuditLogsTable
        loading={this.props.loading}
        list={list}
        count={count}
        users={users}
        kinds={kinds}
        types={types}
        clusters={clusters}
        projects={projects}
        isProjectRole={isProjectRole}
        filter={filter}
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
  return { kubectlLogsList, loading, projectsList, UserSession };
};

export default withRouter(
  connect(mapStateToProps, { getKubectlLogs })(RelayCommands),
);

import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getAuditLogs } from "actions/index";
import LogsDataTable from "../components/LogsDataTable";

const DefaultFilter = {
  timefrom: "1h",
  queryString: "",
};

class SystemLogs extends React.Component {
  constructor(props) {
    super(props);
    const { filter: filterProps = {} } = props;
    this.state = {
      list: [],
      chips: [],
      count: props.count || 0,
      users: [],
      types: [],
      projects: [],
      filter: { ...DefaultFilter, ...filterProps },
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
    const { hits = {}, aggregations = {} } = props?.auditLogsList || {};
    const { visibleApps, visibleSystem, visibleAdmin } = props.UserSession;
    state.list = hits?.hits || [];

    // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html (if more than 1000, hit count might be lower bound)
    state.count = hits?.total?.value || hits?.total || state.list.length;

    // Comments by Zahoor
    // Issue: The following lists are derived from response hence on filtering the number of options vary
    // Fix: If aggregated lists have more options then existing list then update the filter options
    const aggregatedUsers = aggregations?.group_by_username?.buckets;
    const aggregatedTypes = aggregations?.group_by_type?.buckets;
    if (aggregatedUsers?.length > state.users?.length)
      state.users = aggregatedUsers;
    if (aggregatedTypes?.length > state.types?.length)
      state.types = aggregatedTypes;

    const projectList = props?.projectsList?.items.map((p) => {
      return { key: p?.metadata.name };
    });
    state.projects = projectList || [];
    state.isProjectRole = !visibleAdmin && visibleApps && visibleSystem;
    return { ...state };
  }

  handleRefreshClick = (filterProps) => {
    const { isProjectRole, filter } = this.state;
    const { projectId } = this.props.UserSession;
    this.props.getAuditLogs(filterProps || filter, isProjectRole && projectId);
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
    const { list, count, users, types, filter, projects, isProjectRole } =
      this.state;
    return (
      <LogsDataTable
        list={list}
        count={count}
        users={users}
        types={types}
        filter={filter}
        projects={projects}
        isProjectRole={isProjectRole}
        loading={this.props.loading}
        handleFilter={this.handleFilter}
        handleResetFilter={this.handleResetFilter}
        handleRefreshClick={() => this.handleRefreshClick(null)}
        handleRemoveFilter={this.handleRemoveFilter}
      />
    );
  }
}

const mapStateToProps = ({ AuditLogs, Projects, UserSession }) => {
  const { auditLogsList, loading } = AuditLogs;
  const { projectsList } = Projects;
  return { auditLogsList, projectsList, UserSession, loading };
};

export default withRouter(
  connect(mapStateToProps, { getAuditLogs })(SystemLogs)
);

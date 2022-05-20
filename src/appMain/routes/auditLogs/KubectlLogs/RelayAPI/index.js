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
      filter: { ...DefaultFilter, ...filterProps },
      auditType: "RelayAPI",
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
      kind.toLowerCase()
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

    return { ...state };
  }

  handleRefreshClick = (filterProps) => {
    const { auditType, filter } = this.state;
    this.props.getKubectlLogs(filterProps || filter, auditType);
  };

  handleResetFilter = () => {
    const filter = DefaultFilter;
    this.setState({ filter }, this.handleRefreshClick(filter));
  };

  handleFilter = (event) => {
    const { value, name } = event.target;
    const filter = { ...this.state.filter };
    filter[name] = value;
    if (value === "_ALL_") delete filter[name];
    this.setState({ filter }, this.handleRefreshClick(filter));
  };

  handleRemoveFilter = (filterName) => {
    const filter = { ...this.state.filter };
    delete filter[filterName];
    this.setState({ filter }, this.handleRefreshClick(filter));
  };

  render() {
    const { list, count, users, types, kinds, filter } = this.state;
    return (
      <AuditLogsTable
        loading={this.props.loading}
        list={list}
        count={count}
        users={users}
        kinds={kinds}
        types={types}
        filter={filter}
        handleFilter={this.handleFilter}
        handleResetFilter={this.handleResetFilter}
        handleRefreshClick={() => this.handleRefreshClick(null)}
        handleRemoveFilter={this.handleRemoveFilter}
      />
    );
  }
}

const mapStateToProps = ({ AuditLogs, loading }) => {
  const { kubectlLogsList } = AuditLogs;
  return { kubectlLogsList, loading };
};

export default withRouter(
  connect(mapStateToProps, { getKubectlLogs })(RelayCommands)
);

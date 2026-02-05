import React, { useState, useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import SearchBox from "components/SearchBox";
import ExportTable from "../ExportTable";
import FilterField from "../FilterField";
import FilterChip from "../FilterChip";

const TimeStamps = [
  {
    label: "Last 10 min",
    value: "10m",
  },
  {
    label: "Last 1 hour",
    value: "1h",
  },
  {
    label: "Last 24 hours",
    value: "24h",
  },
  {
    label: "Last 1 week",
    value: "7d",
  },
  {
    label: "Last 1 month",
    value: "30d",
  },
];

const ClientTypes = [
  {
    label: "Browser",
    value: "BROWSER",
  },
  {
    label: "CLI",
    value: "CLI",
  },
  {
    label: "KUBECTL",
    value: "KUBECTL",
  },
];

const FILTER_LABEL_MAP = {
  timefrom: "From",
};

const filterToChips = (filter) => {
  return Object.keys(filter).map((key) => {
    return {
      label: key,
      content: filter[key],
    };
  });
};

const TableToolbar = (props) => {
  const {
    handleRefreshClick,
    handleResetFilter,
    handleFilter,
    filter,
    handleRemoveFilter,
  } = props;
  const {
    numSelected,
    isProjectAdmin,
    isProjectRole,
    projects,
    clusters,
    types,
    users,
    kinds,
  } = props;

  const hasProjects = Array.isArray(projects) && projects.length > 0;

  const projectDefaultLabel =
    isProjectRole && hasProjects ? projects[0].key : "All Projects";

  const [chips, setChips] = useState(filterToChips(filter));

  useEffect(() => {
    setChips(filterToChips(filter));
  }, [filter]);

  return (
    <Toolbar
      className={classNames("table-header", {
        "highlight-light": numSelected > 0,
      })}
      style={{ paddingTop: "0px", paddingLeft: "0px" }}
    >
      <div className="d-flex flex-column w-100 pt-3">
        <div className="d-flex justify-content-between">
          <div className="col-md-3 search-wrapper">
            <SearchBox
              name="queryString"
              value={filter.queryString}
              placeholder="Search"
              onChange={handleFilter}
            />
          </div>
          <div className="actions">
            <div style={{ display: "flex" }}>
              <Button
                className="mr-4 bg-white text-red"
                dense="true"
                variant="contained"
                color="default"
                onClick={handleResetFilter}
              >
                Clear&nbsp;Filters
              </Button>
              <Button
                className="mr-4 bg-white text-teal"
                dense="true"
                variant="contained"
                color="default"
                onClick={handleRefreshClick}
              >
                <span>
                  <i className="zmdi zmdi-refresh zmdi-hc-fw " />
                </span>
                Refresh
              </Button>
              <ExportTable list={props.list || []} tableType="System Logs" />
            </div>
          </div>
        </div>
        <div className="pl-3 pt-2 d-flex flex-wrap">
          <div>
            <FilterField
              name="project"
              value={filter.project}
              list={projects}
              defaultLabel={projectDefaultLabel}
              label="Project"
              handleFilter={handleFilter}
            />
          </div>
          <div>
            <FilterField
              name="cluster"
              value={filter.cluster}
              list={clusters}
              defaultLabel="All Clusters"
              label="Cluster"
              handleFilter={handleFilter}
            />
          </div>
          <div className={!isProjectAdmin ? "ml-4" : ""}>
            <FilterField
              name="type"
              value={filter.type}
              list={types}
              defaultLabel="All types"
              label="Type"
              handleFilter={handleFilter}
            />
            <FilterField
              name="kind"
              value={filter.kind}
              list={kinds}
              defaultLabel="All kinds"
              optionValue="value"
              optionLabel="label"
              label="Type"
              handleFilter={handleFilter}
            />
          </div>
          <div className="ml-4">
            <FilterField
              name="user"
              value={filter.user}
              list={users}
              defaultLabel="All users"
              label="User"
              handleFilter={handleFilter}
            />
          </div>
          <div className="ml-4">
            <FilterField
              name="client"
              value={filter.client}
              list={ClientTypes}
              optionValue="value"
              optionLabel="label"
              defaultLabel="All clients"
              label="Client"
              handleFilter={handleFilter}
            />
          </div>
          <div className="ml-4">
            <FilterField
              name="timefrom"
              value={filter.timefrom}
              list={TimeStamps}
              optionValue="value"
              optionLabel="label"
              label="Time Range"
              handleFilter={handleFilter}
              hideAllOption
            />
          </div>
        </div>
        <div className="d-flex flex-column w-100">
          <div className="p-2">
            {chips?.map(
              (chip) =>
                chip.content.length > 0 && (
                  <FilterChip
                    key={`${chip.label}-${chip.content}`}
                    label={chip.label}
                    content={chip.content}
                    onDelete={handleRemoveFilter}
                    labelMap={FILTER_LABEL_MAP}
                  />
                )
            )}
          </div>
        </div>
      </div>
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default TableToolbar;

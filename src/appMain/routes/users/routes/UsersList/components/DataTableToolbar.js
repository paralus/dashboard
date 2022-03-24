import React, { useEffect, useState } from "react";

import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import SearchBox from "components/SearchBox";
import classNames from "classnames";
import T from "i18n-react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const STATUS_OPTIONS = [
  { id: "ALL", name: "Active/Inactive" },
  { id: "active", name: "Active" },
  { id: "inactive", name: "Inctive" },
];

const DataTableToolbar = (props) => {
  const {
    numSelected,
    handleCreateClick,
    searchValue,
    handleSearchChange,
    hideAdd,
    filters,
    handleFilterChange,
    projectsList,
    groupsList,
    rolesList,
  } = props;

  const [projectOptions, setProjectOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    // setting project filter options
    if (projectsList) {
      let projects = [];
      projects = projectsList.map((p) => ({
        id: p.metadata.name,
        name: p.metadata.name,
      }));
      projects.unshift({ id: "ALL", name: "All Projects" });
      setProjectOptions(projects);
    }
  }, [projectsList]);

  useEffect(() => {
    if (groupsList) {
      const groupsData = groupsList ?? [];
      let groups = [];
      groups = groupsData?.map((g) => ({
        id: g.metadata.name,
        name: g.metadata.name,
      }));
      groups.unshift({ id: "ALL", name: "All Groups" });
      setGroupOptions(groups);
    }
  }, [groupsList]);

  useEffect(() => {
    if (rolesList?.length) {
      let roles = [];
      roles = rolesList?.map((g) => ({
        id: g.metadata.name,
        name: g.metadata.name,
      }));
      roles.unshift({ id: "ALL", name: "All Roles" });
      setRoleOptions(roles);
    }
  }, [rolesList]);
  const placeholder = T.translate("user.search.placeholder");
  return (
    <>
      <Toolbar
        className={classNames("table-header", {
          "highlight-light": numSelected > 0,
        })}
        style={{
          paddingTop: "15px",
          paddingBottom: "15px",
          paddingLeft: "0px",
        }}
      >
        <div className="col-md-4 search-wrapper">
          <SearchBox
            placeholder={placeholder}
            onChange={handleSearchChange}
            value={searchValue}
          />
        </div>
        <div className="spacer" />

        <div className="col-md-8">
          <div className="actions">
            {!hideAdd && (
              <Button
                variant="contained"
                className="jr-btn jr-btn-label left text-nowrap text-white"
                onClick={(event) => handleCreateClick(event)}
                style={{ marginRight: 8, float: "right" }}
                color="primary"
                id="new_user_button"
              >
                <i className="zmdi zmdi-plus zmdi-hc-fw " />
                <T.span text="user.create.new_user" />
              </Button>
            )}
          </div>
        </div>
      </Toolbar>
      {filters && (
        <div
          className="d-flex flex-wrap"
          style={{
            padding: "15px 0",
          }}
        >
          <TableFilter
            id="project-filter"
            label="Projects"
            onChange={(e) => handleFilterChange("project_name", e.target.value)}
            options={projectOptions}
            value={filters?.project_name}
            multiselect
          />
          <TableFilter
            id="role-filter"
            label="Role"
            onChange={(e) => handleFilterChange("role_name", e.target.value)}
            options={roleOptions}
            value={filters?.role_name}
          />
          <TableFilter
            id="group-filter"
            label="Group"
            onChange={(e) => handleFilterChange("group_name", e.target.value)}
            options={groupOptions}
            value={filters?.group_name}
          />
          <TableFilter
            id="status-filter"
            label="Status"
            onChange={(e) => handleFilterChange("status", e.target.value)}
            options={STATUS_OPTIONS}
            value={filters?.status}
          />
        </div>
      )}
    </>
  );
};

function TableFilter(props) {
  const { label, id, value, defaultValue, onChange, options, multiselect } =
    props;
  return (
    <div style={{ display: "flex", maxWidth: "100%" }} className="pl-4">
      <TextField
        className="float-right"
        margin="normal"
        id={id}
        select
        SelectProps={
          multiselect
            ? {
                multiple: true,
                value,
                renderValue: (data) => (
                  <p
                    style={{
                      margin: 0,
                      color: "#009688",
                      fontSize: "medium",
                      overflowWrap: "break-word",
                    }}
                  >
                    {data.join(", ")}
                  </p>
                ),
              }
            : {}
        }
        value={value || defaultValue}
        onChange={onChange}
        fullWidth
        label={label}
        style={{
          color: "#009688",
          fontSize: "medium",
          marginTop: "8px",
          width: "100%",
        }}
        InputProps={{
          disableUnderline: true,
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            value={option.id}
            style={{ color: "#009688", fontSize: "medium" }}
          >
            <span style={{ color: "#009688", fontSize: "medium" }}>
              {option.name}
            </span>
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

export default DataTableToolbar;

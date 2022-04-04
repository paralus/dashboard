import React from "react";
import classNames from "classnames";
import Toolbar from "@material-ui/core/Toolbar";
import SearchBox from "components/SearchBox";
import Button from "@material-ui/core/Button";
import T from "i18n-react";

const TableToolbar = (props) => {
  const { searchValue, numSelected, handleCreateClick, handleSearchChange } =
    props;
  const placeholder = "Search";
  return (
    <Toolbar
      className={classNames("table-header", {
        "highlight-light": numSelected > 0,
      })}
      style={{ paddingTop: "0px", paddingLeft: "0px" }}
    >
      <div className="col-md-4 search-wrapper">
        <SearchBox
          placeholder={placeholder}
          onChange={handleSearchChange}
          value={searchValue}
        />
      </div>
      <div className="spacer" />
      <div className="actions">
        <Button
          variant="contained"
          className="jr-btn jr-btn-label left text-nowrap text-white"
          onClick={(event) => handleCreateClick(event)}
          style={{ marginRight: 8 }}
          color="primary"
          id="new_group"
        >
          <i className="zmdi zmdi-plus zmdi-hc-fw " />
          <span>New Role</span>
        </Button>
      </div>
    </Toolbar>
  );
};

export default TableToolbar;

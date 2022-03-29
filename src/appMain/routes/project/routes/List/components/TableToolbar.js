import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

const TableToolbar = (props) => {
  const { numSelected, handleCreateClick, session } = props;

  if (!session.visibleAdmin) return null;

  return (
    <Toolbar
      className={classNames("table-header", {
        "highlight-light": numSelected > 0,
      })}
      style={{ paddingTop: "0px", paddingLeft: "0px" }}
    >
      <div style={{ display: "flex" }} className="pl-4" />
      <div className="spacer" />
      <div className="actions">
        <Button
          variant="contained"
          className="jr-btn jr-btn-label left text-nowrap text-white"
          onClick={handleCreateClick}
          style={{ marginRight: 8 }}
          color="primary"
          id="new_project"
        >
          <i className="zmdi zmdi-plus zmdi-hc-fw " />
          <span>New Project</span>
        </Button>
      </div>
    </Toolbar>
  );
};

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default TableToolbar;

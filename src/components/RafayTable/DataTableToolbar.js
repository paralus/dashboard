import React from "react";
import classNames from "classnames";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchBox from "components/SearchBox";
import Button from "@material-ui/core/Button";

const DataTableToolbar = ({
  title,
  button,
  buttonLabel,
  handleCreateClick,
  buttonDisabled,
  searchBox,
}) => {
  if (!button && !buttonLabel) return null;
  return (
    <Toolbar
      className="table-header"
      style={{ paddingTop: "0px", paddingLeft: "0px" }}
    >
      <div className="pl-3" style={{ flex: "none" }}>
        {title && <h3 className="m-0">{title}</h3>}
        {searchBox}
      </div>
      <div className="spacer" />
      <div className="actions">
        {button}
        {!button && (
          <Button
            variant="contained"
            className="jr-btn jr-btn-label left text-nowrap text-white"
            onClick={(event) => handleCreateClick(event)}
            style={{ marginRight: 8 }}
            color="primary"
            id="new_group"
            disabled={buttonDisabled}
          >
            <i className="zmdi zmdi-plus zmdi-hc-fw " />
            <span>{buttonLabel}</span>
          </Button>
        )}
      </div>
    </Toolbar>
  );
};

export default DataTableToolbar;

import React from "react";

import { Paper, IconButton } from "@material-ui/core";

const ViewSwitcher = ({ renderInTable, setRenderInTable }) => {
  return (
    <div>
      <Paper className="mr-0 ml-1" style={{ display: "inline-block" }}>
        <div className="d-flex">
          <div style={!renderInTable ? { backgroundColor: "lightgrey" } : null}>
            <IconButton
              className="size-30 p-0"
              onClick={(_) => {
                setRenderInTable(false);
              }}
            >
              <i
                className={`zmdi zmdi-view-module ${
                  renderInTable ? "text-teal" : null
                }`}
              />
            </IconButton>
          </div>
          <div style={renderInTable ? { backgroundColor: "lightgrey" } : null}>
            <IconButton
              className="size-30 p-0"
              style={{ padding: "0px" }}
              onClick={(_) => {
                setRenderInTable(true);
              }}
            >
              <i
                className={`zmdi zmdi-view-list-alt ${
                  !renderInTable ? "text-teal" : null
                }`}
              />
            </IconButton>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default ViewSwitcher;

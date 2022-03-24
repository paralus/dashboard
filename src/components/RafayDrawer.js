import React from "react";

import { Drawer, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const RafayDrawer = ({ open, onClose, children, title, width, actions }) => {
  const windowWidth = width || window.innerWidth * 0.5;
  return (
    <div>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <div
          style={{
            width: windowWidth,
            minWidth: "750px",
            position: "relative",
          }}
        >
          <div className="p-3" style={{ background: "#def3f1" }}>
            <div className="d-flex justify-content-between">
              <h3 className="m-0 font-weight-bold">{title}</h3>
              <div className="d-flex flex-row">
                {actions}
                <IconButton
                  aria-label="delete"
                  className="p-0"
                  onClick={onClose}
                >
                  <CloseIcon fontSize="default" />
                </IconButton>
              </div>
            </div>
          </div>
          {children}
        </div>
      </Drawer>
    </div>
  );
};

export default RafayDrawer;

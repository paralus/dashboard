import React from "react";
import { Popover } from "@material-ui/core";
import Widget from "./Widget";

const FontSize = ({ anchorEl, open, onClose, handleReload }) => {
  return (
    <Popover
      id="settings-popover"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Widget handleClose={onClose} handleReload={handleReload} />
    </Popover>
  );
};

export default FontSize;

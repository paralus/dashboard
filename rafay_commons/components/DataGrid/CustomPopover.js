import React, { useState } from "react";
import PropTypes from "prop-types";
import { Popover, IconButton } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

const DefaultAnchor = ({ onClick, key }) => (
  <IconButton aria-label="settings" onClick={onClick} key={key}>
    <SettingsIcon fontSize="small" />
  </IconButton>
);

export default function CustomPopover({
  anchor,
  children,
  className,
  style,
  transformOrigin,
  anchorOrigin
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = event => {
    setAnchorEl(event.target);
  };
  const handleClose = event => {
    setAnchorEl(null);
  };

  return (
    <div className={className} style={style}>
      {React.cloneElement(anchor || <DefaultAnchor />, {
        key: "popover-anchor",
        onClick: handleOpen
      })}
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={transformOrigin}
      >
        {children}
      </Popover>
    </div>
  );
}

CustomPopover.propTypes = {
  anchor: PropTypes.node,
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(["top", "center", "bottom"]),
    horizontal: PropTypes.oneOf(["left", "center", "right"])
  }),
  transformOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(["top", "center", "bottom"]),
    horizontal: PropTypes.oneOf(["left", "center", "right"])
  })
};

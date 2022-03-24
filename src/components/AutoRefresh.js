import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Intervals = [3, 5, 10, 30];

const AutoRefresh = ({ autoRefreshInterval = 3, setAutoRefreshInterval }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (i) => {
    setAnchorEl(null);
    setAutoRefreshInterval(i);
  };

  return (
    <div className="d-flex flex-row align-items-center">
      <span>Auto Refresh</span>
      <div>
        <Button
          aria-controls="autorefresh-menu"
          aria-haspopup="true"
          id="autorefresh-menu-btn"
          onClick={handleClick}
          size="small"
          endIcon={<ExpandMoreIcon />}
          color="primary"
          className="text-lowercase"
        >
          {`${autoRefreshInterval}s`}
        </Button>
        <Menu
          id="autorefresh-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={(_) => setAnchorEl(null)}
        >
          {Intervals.map((i) => (
            <MenuItem
              key={i}
              selected={autoRefreshInterval === i}
              onClick={(_) => handleClose(i)}
            >
              {`${i}s`}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default AutoRefresh;

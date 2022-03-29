import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SettingsIcon from "@material-ui/icons/Settings";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import CachedIcon from "@material-ui/icons/Cached";

const WizardActions = ({
  showOpenInNew,
  handleOpenInNew,
  handleReload,
  handleSettings,
  handleDrawerClose,
  handleClose,
}) => {
  return (
    <>
      {showOpenInNew && (
        <Tooltip title="Open in new window">
          <IconButton
            key="openinnew"
            aria-label="Open In New"
            color="inherit"
            onClick={handleOpenInNew}
          >
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Reset">
        <IconButton
          key="settings"
          aria-label="Reset"
          color="inherit"
          onClick={handleReload}
        >
          <CachedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Settings">
        <IconButton
          key="settings"
          aria-label="Settings"
          color="inherit"
          onClick={handleSettings}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Close">
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => {
            if (showOpenInNew) {
              handleDrawerClose();
              return;
            }
            handleClose();
          }}
        >
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default WizardActions;

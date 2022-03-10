import React, { useState } from "react";
import { ListItemText, Menu, MenuItem, IconButton } from "@material-ui/core";
import * as Constants from "constants/ClusterActions";

const ClusterActionsContainer = ({ icon, menuItems, dialogs, onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(undefined);

  const onOptionMenuSelect = event => {
    setMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleRequestClose = () => {
    setMenuOpen(false);
  }

  const selectOption = event => {
    const innerText = event.target.innerText;
    handleRequestClose();
    setSelectedOption(innerText);
    onSelect(innerText);
  }

  const clusterMenu = () => {
    return (
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleRequestClose}
      >
        <MenuItem
          className="p-0"
          key="menu-default"
          style={{ height: "0px" }}
        />
        {menuItems.map(option => (
          <MenuItem key={option} selected={option === selectedOption} onClick={selectOption}>
            <ListItemText
              className="my-0"
              primary={option}
              secondary={Constants?.SECONDARY_TEXT[option]}
            />
          </MenuItem>
        ))}
      </Menu>
    )
  }

  return (
    <div>
      <div className="text-right">
        <IconButton
          className="size-30 p-0"
          onClick={onOptionMenuSelect}
        >
          <i className={`zmdi zmdi-${icon}`} />
        </IconButton>
        {clusterMenu()}
      </div>
      {dialogs}
    </div>
  )
}

export default ClusterActionsContainer;

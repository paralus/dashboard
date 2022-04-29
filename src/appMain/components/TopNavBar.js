import React, { useState } from "react";

import { useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import HomeIcon from "@material-ui/icons/Home";
import BuildIcon from "@material-ui/icons/Build";
import HelpIcon from "@material-ui/icons/Help";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SettingsIcon from "@material-ui/icons/Settings";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles(() => ({
  button: {
    "&:hover": {
      color: "teal",
      backgroundColor: "#00000008",
    },
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  buttonSelected: {
    fontWeight: "500",
    color: "teal !important",
    borderBottom: "3px solid teal",
    borderRadius: "0px",
    marginBottom: "-3px",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
}));

const MenuOption = ({ option, onClose, tref }) => {
  const location = useLocation();
  const history = useHistory();
  const handleMenuItemClick = (event, path) => {
    history.push(path);
    onClose();
  };
  return (
    <MenuItem
      ref={tref}
      disabled={option.disabled}
      selected={option.path === location.pathname}
      onClick={(event) => handleMenuItemClick(event, option.path)}
    >
      {option.label}
    </MenuItem>
  );
};

const MenuOptionsList = React.forwardRef(
  ({ options, onClose, isSelected }, ref) =>
    options
      .filter((m) => !m.hide)
      .map((option, index) => {
        if (option.nested?.length > 0)
          return (
            <CollapsibleMenuButton
              tref={ref}
              key={index}
              option={option}
              onClose={onClose}
              isSelected={isSelected}
            />
          );
        return (
          <MenuOption
            tref={ref}
            key={index}
            option={option}
            onClose={onClose}
          />
        );
      })
);

const MenuButton = ({ icon, label, options, hide }) => {
  if (hide) return null;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const allRoutes = options.reduce((acc, curr) => {
    const { path, nested } = curr;
    if (nested) {
      const routesNested = nested.map((x) => x.path);
      acc.push(...routesNested);
      return acc;
    }
    acc.push(path);
    return acc;
  }, []);

  const isSelected = allRoutes.includes(location.pathname);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        size="small"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className={isSelected ? classes.buttonSelected : classes.button}
        startIcon={icon}
      >
        <span>{label}</span>
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem key="-1" disabled>
          {label}
        </MenuItem>
        <MenuOptionsList
          options={options}
          onClose={handleClose}
          isSelected={isSelected}
        />
      </Menu>
    </>
  );
};

const NavButton = ({ icon, label, path, blank, hide }) => {
  if (hide) return null;
  const classes = useStyles();
  const location = useLocation();
  const isSelected = path === location.pathname;

  if (blank) {
    return (
      <Button
        size="small"
        className={classes.button}
        href={path}
        target="_blank"
        startIcon={icon}
      >
        {label}
      </Button>
    );
  }
  return (
    <Button
      size="small"
      disabled={isSelected}
      className={isSelected ? classes.buttonSelected : classes.button}
      // color={isSelected ? "default" : ""}
      href={`/#${path}`}
      startIcon={icon}
    >
      {label}
    </Button>
  );
};

const CollapsibleMenuButton = ({ option, onClose, isSelected, tref }) => {
  const [open, setOpen] = useState(isSelected);

  const toggleCollapsible = () => {
    setOpen((open) => !open);
  };

  return (
    <>
      <ListItem
        ref={tref}
        dense
        button
        onClick={toggleCollapsible}
        disabled={option.disabled}
      >
        <ListItemText primary={option.label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto">
        <div className="ml-3" style={{ borderLeft: "1px solid grey" }}>
          <MenuOptionsList
            options={option.nested}
            onClose={onClose}
            // isSelected={isSelected}
          />
        </div>
      </Collapse>
    </>
  );
};

const TopNavBar = () => {
  const UserSession = useSelector((state) => state.UserSession);
  const { partnerDetail } = useSelector((state) => {
    return {
      partnerDetail: state.settings.partnerDetail,
    };
  });
  const hide = !UserSession.visibleAdmin;
  const docs_link =
    partnerDetail?.settings?.docs_link || "https://docs-rafaylabs.vercel.app/";

  return (
    <div>
      <NavButton icon={<HomeIcon />} label="Home" path="/main" />
      <MenuButton
        icon={<SettingsIcon />}
        label="System"
        options={[
          { label: "Users", path: "/main/users", hide },
          { label: "Groups", path: "/main/groups", hide },
          { label: "Roles", path: "/main/roles", hide },
          { label: "Identity Providers", path: "/main/sso", hide },
          { label: "Audit Logs", path: "/main/audit" },
          { label: "Settings", path: "/main/settings", hide },
        ]}
      />
      <NavButton
        icon={<BuildIcon />}
        label="My Tools"
        path="/main/tools"
        // hide={hide}
      />
      <NavButton
        icon={<HelpIcon />}
        label="Documentation"
        path={docs_link}
        blank
      />
      <NavButton
        icon={<AssignmentIcon />}
        label="API Docs"
        path="/swagger-ui/"
        blank
      />
    </div>
  );
};

export default TopNavBar;

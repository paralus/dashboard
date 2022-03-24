import React, { useEffect } from "react";
import Drawer from "@material-ui/core/Drawer";
import { useSelector, useDispatch } from "react-redux";
import {
  COLLAPSED_DRAWER,
  FIXED_DRAWER,
  MINI_DRAWER,
} from "constants/ActionTypes";
import { setDrawerType } from "actions/index";
import SideNavContent from "./SidenavContent";

const SideNav = ({ onToggleCollapsedNav }) => {
  const { navCollapsed, drawerType } = useSelector((state) => {
    const { navCollapsed, drawerType } = state.settings;
    return { navCollapsed, drawerType };
  });
  const dispatch = useDispatch();

  useEffect(
    (_) => {
      if (window.innerWidth < 1200) {
        dispatch(setDrawerType(MINI_DRAWER));
      }
    },
    [window.innerWidth]
  );

  const drawerStyle = drawerType.includes(FIXED_DRAWER)
    ? "d-xl-flex"
    : drawerType.includes(COLLAPSED_DRAWER)
    ? ""
    : "d-flex";
  return (
    <div className={`app-sidebar d-none ${drawerStyle}`}>
      <Drawer
        className="app-sidebar-content"
        variant="permanent"
        open={navCollapsed}
        onClose={onToggleCollapsedNav}
        classes={{
          paper: "side-nav",
        }}
      >
        <div style={{ padding: "40px" }} />
        <SideNavContent />
      </Drawer>
    </div>
  );
};
export default SideNav;

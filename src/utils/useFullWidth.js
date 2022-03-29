import React from "react";
import { useSelector } from "react-redux";

export default function useFullWidth() {
  const drawerType = useSelector((s) => s.settings.drawerType);
  return `calc(100% - ${drawerType === "fixed_drawer" ? 200 : 80}px)`;
}

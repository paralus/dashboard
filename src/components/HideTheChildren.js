import React from "react";

export default function HideTheChildren({ hide, children, component = null }) {
  if (children && !hide) return children;
  return component;
}

import React from "react";

export default function IfThen({ condition, children }) {
  if (condition) {
    return children;
  }

  return null;
}

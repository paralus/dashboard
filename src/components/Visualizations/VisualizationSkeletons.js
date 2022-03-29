import React from "react";
import classnames from "classnames";

export default function BasicNoDataSkeleton({
  className,
  text = "No data to show.",
}) {
  return (
    <div
      className={classnames({ [className]: Boolean(className) })}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#757575",
      }}
    >
      <span>{text}</span>
    </div>
  );
}

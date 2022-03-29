import React from "react";

export default function CountCard(props) {
  const { title, count, onClick, noMarginTop, countFontSize = "large" } = props;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: noMarginTop ? 0 : ".5rem",
      }}
    >
      <span className="mb-0" style={{ fontWeight: "500" }}>
        {title}
      </span>
      <span>
        <b
          style={{
            color: "teal",
            cursor: count > 0 ? "pointer" : "default",
            fontSize: countFontSize,
          }}
          onClick={onClick}
        >
          <span>{count}</span>
        </b>
      </span>
    </div>
  );
}

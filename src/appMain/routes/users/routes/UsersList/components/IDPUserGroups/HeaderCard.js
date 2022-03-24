import React from "react";
import { Paper } from "@material-ui/core";

const HeaderCard = ({ header, className, children }) => {
  return (
    <Paper className={className}>
      <div
        style={{
          borderBottom: "1px solid lightgrey",
          borderLeft: "3px solid teal",
          borderTop: "1px solid teal",
          borderTopLeftRadius: "3px",
        }}
      >
        {header}
      </div>
      {children}
    </Paper>
  );
};

export default HeaderCard;

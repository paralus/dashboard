import React, { useState } from "react";
import { Tooltip, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  longTextStyle: {
    margin: "0px",
    width: "100px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}));

const RafayLongText = ({ text, style }) => {
  const classes = useStyles();
  const [isToolTipOpen, setTooltipStatus] = useState(false);
  return (
    <Tooltip title={text} open={isToolTipOpen}>
      <p
        className={classes.longTextStyle}
        style={style}
        onMouseEnter={e => {
          const { offsetWidth, scrollWidth } = e.target;
          if (offsetWidth < scrollWidth) setTooltipStatus(true);
        }}
        onMouseLeave={e => {
          const { offsetWidth, scrollWidth } = e.target;
          if (offsetWidth < scrollWidth) setTooltipStatus(false);
        }}
      >
        {text}
      </p>
    </Tooltip>
  );
};

export default RafayLongText;

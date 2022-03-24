import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Button, Slider, Typography } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import useLocalStorage from "utils/useLocalStorage";

const useStyles = makeStyles({
  root: {
    width: 320,
  },
  content: {
    padding: "15px",
  },
  header: {
    marginBottom: "30px",
    padding: "15px",
    borderBottom: "1px solid lightgrey",
  },
  helptext: {
    fontSize: "12px",
    fontWeight: "400",
  },
  example: {
    background: "lightgrey",
    border: "1px solid lightgrey",
    padding: "3px",
  },
  borderTop: { borderTop: "1px solid lightgrey", padding: "10px" },
});

const loadSize = (fontSize, setFontSize) => {
  if (!fontSize) {
    setFontSize(12);
    return 12;
  }
  return fontSize;
};

const Widget = ({ handleClose, handleReload }) => {
  const classes = useStyles();
  const [fontSize, setFontSize] = useLocalStorage("kubectlFontSize");
  const [value, setValue] = useState(loadSize(fontSize, setFontSize));
  return (
    <div className={classes.root}>
      <div id="header" className={classes.header}>
        <Typography id="title" gutterBottom>
          Font Size
        </Typography>
        <Typography id="helptext" className={classes.helptext} gutterBottom>
          *** Note: Changing font size will reload the current session
        </Typography>
      </div>
      <div id="content" className={classes.content}>
        <div id="slider" className="d-flex flex-row align-items-center">
          <IconButton
            id="smaller-button"
            key="smaller"
            aria-label="smaller"
            color="inherit"
            className="mr-2"
            onClick={() => {
              if (value > 12) setValue(value - 2);
            }}
          >
            <RemoveCircleIcon />
          </IconButton>
          <Slider
            id="discrete-slider"
            getAriaValueText={(val) => val}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            value={value}
            onChange={(_, val) => setValue(val)}
            step={2}
            marks
            min={12}
            max={36}
          />
          <IconButton
            id="larger-button"
            key="larger"
            aria-label="larger"
            color="inherit"
            className="ml-2"
            onClick={() => {
              if (value < 36) setValue(value + 2);
            }}
          >
            <AddCircleIcon />
          </IconButton>
        </div>
        <div id="demo" className="d-flex flex-column p-3">
          <Typography id="demo-label">Text :&nbsp;</Typography>
          <Typography
            id="demo-size"
            className={classes.example}
            style={{
              fontSize: `${value}px`,
            }}
          >
            kubectl get po
          </Typography>
        </div>
      </div>
      <div
        className={`d-flex justify-content-end align-items-center ${classes.borderTop}`}
      >
        <Button onClick={handleClose} id="cancel" type="button">
          Cancel
        </Button>
        <Button
          type="button"
          color="primary"
          id="apply"
          onClick={() => {
            setFontSize(value);
            handleReload();
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default Widget;

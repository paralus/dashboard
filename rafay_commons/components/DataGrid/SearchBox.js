import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles, fade } from "@material-ui/core/styles";
import { InputBase } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.06),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.09)
    },
    marginLeft: 0,
    width: "100%"
  },
  searchIcon: {
    width: theme.spacing(4),
    color: fade(theme.palette.common.black, 0.4),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    fontSize: 16,
    padding: theme.spacing(1, 1, 1, 4),
    transition: theme.transitions.create("width"),
    "&::placeholder": {
      fontSize: 16
    }
  }
}));

const debounce = (milliseconds, handler) => {
  let timeout = null;
  return value => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (handler) handler(value);
    }, milliseconds);
  };
};

export default function SearchBox({
  onSearchChanged,
  timeout = 500,
  placeholder = "Search",
  inputStyle,
  className,
  searchText = ""
}) {
  const classes = useStyles();
  const [value, setValue] = useState(searchText);
  const onChangeDebounced = useRef(debounce(timeout, onSearchChanged));
  const handleChange = e => setValue(e.target.value);

  useEffect(() => {
    onChangeDebounced.current(value);
  }, [value]);

  useEffect(() => {
    setValue(searchText);
  }, [searchText]);

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon fontSize="small" />
      </div>
      <InputBase
        value={value}
        style={inputStyle}
        className={className}
        onChange={handleChange}
        placeholder={placeholder}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  );
}

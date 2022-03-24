import { InputBase, makeStyles } from "@material-ui/core";
import React from "react";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.09)",
    },
    marginLeft: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    "& input::placeholder": {
      fontSize: 14,
    },
  },
  searchIcon: {
    width: theme.spacing(4),
    color: "rgba(0, 0, 0, 0.4)",
    height: "100%",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const SearchBoxV2 = ({ placeholder, value, onChange }) => {
  const classes = useStyles();
  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon fontSize="small" />
      </div>
      <InputBase
        fullWidth
        id="label-search"
        placeholder={placeholder}
        className={classes.searchBox}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBoxV2;

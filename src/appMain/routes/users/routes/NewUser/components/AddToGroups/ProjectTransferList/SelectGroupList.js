/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
import {
  Grid,
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Checkbox,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  cardHeader: {
    padding: theme.spacing(0, 1),
  },
  listItem: {
    padding: theme.spacing(1, 1),
  },
  list: {
    width: "560px",
    // minHeight: 230,
    maxHeight: "215px",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
    marginLeft: "auto",
  },
  titleCard: {
    display: "flex",
    padding: "20px",
    alignItems: "center",
    marginBottom: "10px",
    width: 600,
    // backgroundColor: "dodgerblue",
    // backgroundColor: "lightgray"
    // color: "white"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

function not(a, b) {
  return a.filter(
    (value) =>
      !b.find((e) => {
        return e.metadata.name === value.metadata.name;
      }),
  );
}

function intersection(a, b) {
  if (!a || !b) return [];
  return a.filter((value) =>
    b.find((e) => {
      return e.metadata.name === value.metadata.name;
    }),
  );
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const SelectGroupList = ({ selectedList, availableList, handleChecked }) => {
  const leftTitle = "Available Users";
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [leftSearchText, setLeftSearchText] = React.useState("");
  const [left, setLeft] = React.useState([]);
  const [leftView, setLeftView] = React.useState([]);
  // const [rightView, setRightView] = React.useState([]);
  const [modified, setModified] = React.useState(false);

  // if (
  //   availableList &&
  //   availableList.length > 0 &&
  //   availableList !== left &&
  //   // not(not(availableList, selectedList), left).length > 0 &&
  //   !modified
  // ) {
  //   // setLeft(not(availableList, selectedList));
  //   setLeft(availableList);
  //   setLeftView(availableList);
  // }

  React.useEffect(
    (_) => {
      if (!modified) {
        setLeft(availableList);
        setLeftView(availableList);
      }
    },
    [availableList],
  );

  React.useEffect(
    (_) => {
      if (!modified) {
        setChecked(selectedList);
      }
    },
    [selectedList],
  );

  // if (
  //   selectedList &&
  //   selectedList.length > 0 &&
  //   selectedList !== checked &&
  //   // not(not(availableList, selectedList), left).length > 0 &&
  //   !modified
  // ) {
  //   setChecked(selectedList);
  // }

  // const leftChecked = intersection(checked, left);
  // const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    setModified(true);
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    handleChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    const dui = items.find((i) => i.spec.type === "DEFAULT_USERS");
    setModified(true);
    let newChecked = [];
    if (numberOfChecked(items) === items.length) {
      if (dui) {
        newChecked = [...not(checked, items), dui];
      } else {
        newChecked = not(checked, items);
      }
    } else {
      newChecked = union(checked, items);
    }
    setChecked(newChecked);
    handleChecked(newChecked);
  };

  const handleSearch = (e, type) => {
    const val = e.target.value;
    if (type === "left") {
      setLeftSearchText(val);
      setLeftView(left.filter((n) => n.name.indexOf(val) !== -1));
    }
  };

  const handleClearSearch = (e, type) => {
    if (type === "left") {
      setLeftSearchText("");
      setLeftView(left);
    }
  };

  const inputAdor = (type) => {
    if (leftSearchText.length) {
      return (
        <InputAdornment position="end">
          <IconButton
            // size="small"
            aria-label="Clear search"
            onClick={(e) => handleClearSearch(e, type)}
          >
            <i
              className="zmdi zmdi-close "
              style={{ fontSize: "20px", color: "red" }}
            />
          </IconButton>
        </InputAdornment>
      );
    }
    return null;
  };

  const customList = (type, title, items) => (
    <Card elevation={0} variant="outlined">
      <div className="w-100">
        <TextField
          fullWidth
          className={classes.margin}
          id="input-with-icon-textfield"
          label="Search"
          variant="filled"
          onChange={(e) => handleSearch(e, type)}
          value={leftSearchText}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <i className="zmdi zmdi-search zmdi-hc-lg" />
              </InputAdornment>
            ),
            endAdornment: inputAdor(type),
          }}
        />
      </div>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            color="primary"
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 1
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={
          <div>
            <span>Select All</span>
            <span style={{ float: "right" }} className="text-muted">
              {`${numberOfChecked(items)}/${items.length} selected`}
            </span>
          </div>
        }
        // subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value, index) => {
          const labelId = `transfer-list-all-item-${index}-label`;

          return (
            <ListItem
              key={index}
              role="listitem"
              button
              onClick={
                value.spec.type !== "DEFAULT_USERS"
                  ? handleToggle(value)
                  : undefined
              }
              className={classes.listItem}
            >
              <ListItemIcon>
                <Checkbox
                  color="primary"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  disabled={value.spec.type === "DEFAULT_USERS"}
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              {value.spec.type === "DEFAULT_USERS" && (
                <ListItemText
                  id={labelId}
                  primary={<strong>{`${value.metadata.name}`}</strong>}
                  secondary="Default group for all local users"
                />
              )}
              {value.spec.type === "DEFAULT_ADMINS" && (
                <ListItemText
                  id={labelId}
                  primary={<strong>{`${value.metadata.name}`}</strong>}
                  secondary="Default group for all Organization Admins"
                />
              )}
              {value.spec.type === "DEFAULT_READONLY_ADMINS" && (
                <ListItemText
                  id={labelId}
                  primary={<strong>{`${value.metadata.name}`}</strong>}
                  secondary="Default group for all Organization Read Only"
                />
              )}
              {value.spec.type === "SYSTEM" && (
                <ListItemText id={labelId} primary={`${value.metadata.name}`} />
              )}
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <>
      <Paper className={classes.titleCard}>
        <div>
          <h2 className="h2 mb-0">Add Groups</h2>
          <p className="text-muted pt-2 mb-2">
            Select all the groups the user can belong to.
          </p>
          <div>{customList("left", leftTitle, leftView)}</div>
        </div>
      </Paper>
    </>
  );
};

export default SelectGroupList;

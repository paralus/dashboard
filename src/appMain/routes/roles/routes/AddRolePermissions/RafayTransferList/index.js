/* eslint-disable react/jsx-wrap-multilines */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import T from "i18n-react";
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
    minWidth: 400,
    minHeight: 230,
    maxHeight: 500,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
    marginLeft: "auto",
  },
  titleCard: {
    display: "flex",
    padding: "10px",
    alignItems: "center",
    marginBottom: "10px",
    // backgroundColor: "dodgerblue",
    backgroundColor: "lightgray",
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
      })
  );
}

function intersection(a, b) {
  return a.filter((value) =>
    b.find((e) => {
      return e.metadata.name === value.metadata.name;
    })
  );
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const TransferList = ({
  selectedList,
  availableList,
  handleAdded,
  handleRemoved,
}) => {
  const leftTitle = "Available Permissions";
  const rightTitle = "Role Permissions";
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [leftSearchText, setLeftSearchText] = React.useState("");
  const [rightSearchText, setRightSearchText] = React.useState("");
  const [left, setLeft] = React.useState([]);
  const [leftView, setLeftView] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [rightView, setRightView] = React.useState([]);
  const [modified, setModified] = React.useState(false);
  if (
    selectedList &&
    selectedList.length > 0 &&
    not(selectedList, right).length > 0 &&
    !modified
  ) {
    setRight([...selectedList]);
    setRightView([...selectedList]);
  }
  if (
    availableList &&
    availableList.length > 0 &&
    not(not(availableList, selectedList), left).length > 0 &&
    !modified
  ) {
    setLeft(not(availableList, selectedList));
    setLeftView(not(availableList, selectedList));
  }

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setModified(true);
    setLeftSearchText("");
    setRightSearchText("");
    setRight(right.concat(leftChecked));
    setRightView(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setLeftView(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    const added = not(right.concat(leftChecked), selectedList);
    handleAdded(added);
  };

  const handleCheckedLeft = () => {
    setModified(true);
    setLeftSearchText("");
    setRightSearchText("");
    setLeft(left.concat(rightChecked));
    setLeftView(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setRightView(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    const removed = not(selectedList, not(right, rightChecked));
    handleRemoved(removed);
  };

  const handleSearch = (e, type) => {
    const val = e.target.value;
    if (type === "left") {
      setLeftSearchText(val);
      setLeftView(left.filter((n) => n.metadata.name.indexOf(val) !== -1));
    }
    if (type === "right") {
      setRightSearchText(val);
      setRightView(right.filter((n) => n.metadata.name.indexOf(val) !== -1));
    }
  };

  const handleClearSearch = (e, type) => {
    if (type === "left") {
      setLeftSearchText("");
      setLeftView(left);
    }
    if (type === "right") {
      setRightSearchText("");
      setRightView(right);
    }
  };

  const inputAdor = (type) => {
    if (
      (type === "left" && leftSearchText.length) ||
      (type === "right" && rightSearchText.length)
    ) {
      return (
        <InputAdornment position="end">
          <IconButton
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
          value={type === "left" ? leftSearchText : rightSearchText}
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
              numberOfChecked(items) !== 0
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
              onClick={handleToggle(value)}
              className={classes.listItem}
            >
              <ListItemIcon>
                <Checkbox
                  color="primary"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.metadata.name}`} secondary={`${value.metadata.description}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="stretch"
      className={classes.root}
    >
      <Grid item>
        <Paper className={classes.titleCard}>
          <h2 className="h2 mb-0">
            <T.span text="roles.add_permissions.widget_labels.available_permissions" />
          </h2>
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            <T.span text="roles.add_permissions.widget_button_labels.add_to_role" />
            <i className="zmdi zmdi-long-arrow-right zmdi-hc-2x ml-2" />
          </Button>
        </Paper>
        {customList("left", leftTitle, leftView)}
      </Grid>
      <Grid item>
        <Paper className={classes.titleCard}>
          <h2 className="h2 mb-0">
            <T.span text="roles.add_permissions.widget_labels.role_permissions" />
          </h2>
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
            style={{
              backgroundColor: rightChecked.length > 0 ? "indianred" : "",
            }}
          >
            <i className="zmdi zmdi-long-arrow-left zmdi-hc-2x mr-2" />
            <T.span text="roles.add_permissions.widget_button_labels.remove_from_role" />
          </Button>
        </Paper>
        {customList("right", rightTitle, rightView)}
      </Grid>
    </Grid>
  );
};

export default TransferList;

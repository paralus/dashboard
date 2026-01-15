import React, { useState, useEffect } from "react";
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
import { makeStyles } from "@material-ui/core/styles";
import { useSnack } from "utils/useSnack";

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
    height: 300,
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
    backgroundColor: "lightgray",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const ResourceSharingComp = ({
  projectsList,
  setSelectedProjects,
  selectedProjects = [],
}) => {
  const [checked, setChecked] = useState([]);
  const [items, setItems] = useState([...projectsList]);
  const [searchText, setSearchText] = useState("");
  const classes = useStyles();

  useEffect(
    (_) => {
      const newChecked = [];
      selectedProjects?.length > 0 &&
        projectsList.forEach((project) => {
          if (selectedProjects.includes(project.label)) {
            newChecked.push(project);
          }
        });
      setChecked(newChecked);
    },
    [projectsList, selectedProjects]
  );

  const handleToggle = (value) => () => {
    const currentIndex = checked.findIndex((p) => p.id === value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    setSelectedProjects(newChecked.map((ch) => ch.label));
  };

  const handleSearch = (e, type) => {
    const val = e.target.value;
    setSearchText(val);
    const filteredItems = projectsList.filter(
      (n) => n.label.indexOf(val) !== -1
    );
    setItems(filteredItems);
  };

  const handleClearSearch = () => {
    setItems(projectsList);
    setSearchText("");
  };

  const inputAdor = () => {
    if (searchText?.length > 0) {
      return (
        <InputAdornment position="end">
          <IconButton aria-label="Clear search" onClick={handleClearSearch}>
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

  const handleToggleAll = (items) => () => {
    if (checked.length === projectsList.length) {
      setChecked([]);
      setSelectedProjects([]);
    } else {
      setChecked([...projectsList]);
      setSelectedProjects(projectsList.map((ch) => ch.label));
    }
  };

  return (
    <>
      <div className="row mb-2" style={{ marginLeft: "20px" }}>
        <div className="col-md-6">
          <div className="p-3">
            <Card elevation={0} variant="outlined">
              <div className="w-100">
                <TextField
                  fullWidth
                  className={classes.margin}
                  id="input-with-icon-textfield"
                  label="Search"
                  variant="filled"
                  onChange={(e) => handleSearch(e)}
                  value={searchText}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="zmdi zmdi-search zmdi-hc-lg" />
                      </InputAdornment>
                    ),
                    endAdornment: inputAdor(),
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
                      checked.length === items.length && items.length !== 0
                    }
                    inputProps={{ "aria-label": "all items selected" }}
                  />
                }
                title={
                  <div>
                    <span>Select All</span>
                    <span style={{ float: "right" }} className="text-muted">
                      {`${checked.length}/${items.length} selected`}
                    </span>
                  </div>
                }
              />
              <Divider />
              <List className={classes.list} dense component="div" role="list">
                {items?.map((value, index) => {
                  const labelId = `transfer-list-all-item-${index}-label`;
                  return (
                    <ListItem
                      key={index}
                      role="listitem"
                      button
                      onClick={handleToggle(value)}
                      className={classes.listItem}
                      disabled={value.owner}
                    >
                      <ListItemIcon>
                        <Checkbox
                          color="primary"
                          checked={!!checked.find((p) => p.id === value.id)}
                          tabIndex={-1}
                          disableRipple
                          disabled={value.owner}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>
                      {value.owner ? (
                        <ListItemText
                          id={labelId}
                          primary={<strong>{`${value.label}`}</strong>}
                          secondary="Cluster Owner"
                        />
                      ) : (
                        <ListItemText id={labelId} primary={`${value.label}`} />
                      )}
                    </ListItem>
                  );
                })}
                <ListItem />
              </List>
            </Card>
          </div>
        </div>
        <div className="col-md-6 pt-4">
          <h2>Selected Projects</h2>
          <div>
            {checked?.map((c, i) => {
              return (
                <div key={i} className="mb-1">
                  {c.label}
                </div>
              );
            })}
            {!checked?.length && (
              <span className="font-italic">No Projects Selected</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceSharingComp;

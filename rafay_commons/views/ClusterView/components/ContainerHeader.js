import React, { useState, useEffect, useContext } from "react";
import * as R from "ramda";
import {
  Paper,
  Box,
  Typography,
  makeStyles,
  MenuItem,
  Select,
  FormControl
} from "@material-ui/core";
import { colorCodePhases } from "utils";
import { useQuery } from "../../../utils";
import { ClusterViewContext } from "../ClusterViewContexts";
import { ContainerDropDownTooltip } from "./cluster-view-commons";
import IfThen from "./IfThen";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    display: "flex",
    "& > div": {
      flex: 1
    }
  }
}));

function DropDown_({ options, onChange, value }) {
  const optionsMap = options.map(o => ({ label: o, value: o }));
  return (
    <FormControl
      size="small"
      variant="outlined"
      style={{ marginRight: 8, width: 200, marginBottom: 16 }}
    >
      <Typography
        id={"select-container-label"}
        variant="caption"
        style={{ marginBottom: 2 }}
        color="textSecondary"
      >
        {"Select Container"}
      </Typography>
      <Select
        id="select-container"
        labelId="select-container-label"
        value={value}
        onChange={onChange}
      >
        {optionsMap.map(option => (
          <MenuItem key={option.label} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function ContainerHeader({ resource, title, history, match }) {
  const { podContainers } = useContext(ClusterViewContext);
  const containerSwitchable = podContainers.length;
  const classes = useStyles();
  const { containerReasons, phase } = resource; // resource = pod || container
  const [showDropdown, setShowDropDown] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const { containerStatus } = resource;
  const { query } = useQuery();
  const namespace = query.get("namespace");
  const status = containerStatus
    ? [containerStatus]
    : containerReasons
    ? R.values(containerReasons)
    : [phase];

  useEffect(() => {
    const currContainer = R.pipe(
      R.filter(c => c === title),
      R.head
    )(podContainers);

    setSelectedContainer(currContainer);
  }, []);
  const handleTitleClick = () => {
    if (containerSwitchable) setShowDropDown(true);
  };
  const dropdownOnChange = e => {
    const container = e.target.value;
    const lastIndex = match.url.lastIndexOf("/containers/");
    const podUrl = match.url.substring(0, lastIndex);
    const url = `${podUrl}/containers/${container}?namespace=${namespace}`;
    history.push(url);
  };
  return (
    <Paper className={classes.root}>
      <Box p={2}>
        <Box>
          <DropDown_
            value={selectedContainer}
            options={podContainers}
            onChange={dropdownOnChange}
          />
          {/* <Typography paragraph variant="h5" onClick={handleTitleClick}>
              <Box display="flex" alignItems="center">
                {title}{" "}
                <IfThen condition={containerSwitchable}>
                  <ContainerDropDownTooltip />
                </IfThen>
              </Box>
            </Typography> */}
        </Box>

        <Box display="flex" alignItems="center" height="20px" lineHeight="20px">
          <Typography display="inline">
            Status: {colorCodePhases(status)}
            {/* {colorCodePhases(
              containerReasons ? R.values(containerReasons) : [phase]
            )} */}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

import React, { createContext, useState, useEffect, useRef } from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@material-ui/core";

const DURATION_OPTIONS = [
  { label: "Last 1 hour", value: "1h", seconds: 1000 * 60 * 60 },
  { label: "Last 24 hours", value: "24h", seconds: 1000 * 60 * 60 * 24 },
  // { label: "Last 7 days", value: "7d", seconds: 1000 * 60 * 60 * 24 * 7 },
  // { label: "Last 30 days", value: "30d", seconds: 1000 * 60 * 60 * 24 * 30 }
];
const INTERVAL_OPTIONS = [
  { label: "None", value: 0 },
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "2m", value: 120 },
  { label: "5m", value: 300 },
];

export const TimeControlContext = createContext({});

export function TimeControlProvider({ children, ...props }) {
  const portalRef = useRef(null);
  const [state, setState] = useState({
    duration: DURATION_OPTIONS[0].value,
    interval: INTERVAL_OPTIONS[2].value,
    portalNode: null,
  });

  useEffect(() => {
    if (props.allowPortal)
      setState((s) => ({ ...s, portalNode: portalRef.current }));
  }, []);

  //  TODO there should be some other implementaion for duration
  useEffect(() => {
    localStorage.setItem(
      "_duration_",
      JSON.stringify(DURATION_OPTIONS.find((x) => x.value === state.duration)),
    );
  }, [state.duration]);
  const updateDuration = (e) => {
    setState((s) => ({ ...s, duration: e.target.value }));
  };

  const updateInterval = (e) => {
    setState((s) => ({ ...s, interval: e.target.value }));
  };

  return (
    <TimeControlContext.Provider value={state}>
      <Box
        my={2}
        display="flex"
        justifyContent={props.allowPortal ? "space-between" : "flex-end"}
      >
        {props.allowPortal && <div ref={portalRef}></div>}
        <div>
          <FormControl
            size="small"
            variant="outlined"
            style={{ marginRight: 8, width: 200 }}
          >
            <InputLabel id="duration-label">Duration</InputLabel>
            <Select
              id="duration"
              labelId="duration-label"
              value={state.duration}
              onChange={updateDuration}
              label="Duration"
            >
              {DURATION_OPTIONS.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" variant="outlined" style={{ width: 200 }}>
            <InputLabel id="interval-label">Refresh Interval</InputLabel>
            <Select
              displayEmpty
              id="interval"
              labelId="interval-label"
              value={state.interval}
              onChange={updateInterval}
              label="Refresh Interval"
            >
              {INTERVAL_OPTIONS.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Box>
      {React.cloneElement(children, props)}
    </TimeControlContext.Provider>
  );
}

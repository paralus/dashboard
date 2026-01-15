import React, { useState, useCallback, useEffect, useRef } from "react";

export default function useThunk({
  dispatch,
  thunk, // thunk should always return a promise
  args = [],
  initialData,
  refreshInterval,
  handleResolution,
  handleRejection,
  showLoadingOnRefresh = false,
}) {
  const timeout = useRef(null);
  const stringyArgs = JSON.stringify(args);

  const [state, setState] = useState({
    loading: true,
    data: initialData,
    error: null,
  });

  const setLoading = useCallback((loading) => {
    setState((s) => ({ ...s, loading, error: null }));
  }, []);

  const setData = useCallback((data) => {
    setState({ loading: false, error: null, data });
  }, []);

  const setError = useCallback((error) => {
    setState((s) => ({ ...s, loading: false, error }));
  }, []);

  const callThunk = useCallback(
    (showLoading) => {
      if (showLoading) setLoading(true);
      return (dispatch ? dispatch(thunk(...args)) : thunk(...args))
        .then((response) => {
          const resolved = handleResolution
            ? handleResolution(response.data)
            : response.data;
          setData(resolved);
          return resolved;
        })
        .catch((error) => {
          const rejected = handleRejection ? handleRejection(error) : error;
          setError(rejected);
          throw error;
        });
    },
    [stringyArgs],
  );

  const callThunkWithInterval = useCallback(
    (initLoading) => {
      clearInterval(timeout.current);
      callThunk(initLoading);

      if (refreshInterval) {
        timeout.current = setInterval(() => {
          callThunk(showLoadingOnRefresh);
        }, refreshInterval * 1000);
      }
    },
    [stringyArgs],
  );

  const unmount = useCallback(() => {
    clearInterval(timeout.current);
  }, []);

  useEffect(() => {
    callThunkWithInterval(!!timeout.current || true);
  }, [thunk, stringyArgs, refreshInterval]);

  useEffect(() => {
    return unmount;
  }, []);

  return { ...state, refresh: callThunk };
}

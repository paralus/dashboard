import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import http from "../actions/Config";
import { makeCancelable } from "./helpers";

const Axios = axios.create({
  timeout: 60000 * 2,
});

export default function useAPI({
  options,
  args,
  initialData,
  refreshInterval,
  handleResolution,
  handleRejection,
  showLoadingOnRefresh = false,
}) {
  const timeout = useRef(null);
  const cancelable = useRef(null);
  const optionsAndArgs = JSON.stringify({ options, args });

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

  const callAPI = useCallback(
    (showLoading) => {
      if (showLoading) setLoading(true);
      const { type, version, noTrailingSlash } = options || {};
      cancelable.current = makeCancelable(
        options ? http(type, version, noTrailingSlash)(...args) : Axios(...args)
      );
      cancelable.current.promise
        .then((response) => {
          setData(
            handleResolution ? handleResolution(response.data) : response.data
          );
        })
        .catch((error) => {
          setError(handleRejection ? handleRejection(error) : error);
        });
    },
    [optionsAndArgs]
  );

  const callAPIwithInterval = useCallback(
    (initLoading) => {
      clearInterval(timeout.current);
      callAPI(initLoading);

      if (refreshInterval) {
        timeout.current = setInterval(() => {
          callAPI(showLoadingOnRefresh);
        }, refreshInterval * 1000);
      }
    },
    [optionsAndArgs]
  );

  useEffect(() => {
    callAPIwithInterval(!!timeout.current || true);
  }, [optionsAndArgs, refreshInterval]);

  useEffect(() => {
    return () => {
      if (cancelable.current) cancelable.current.cancel();
      clearInterval(timeout.current);
    };
  }, []);

  return state;
}

import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import equals from "ramda/src/equals";
import { makeCancelable, debounce } from "../utils";

const Axios = axios.create({
  timeout: 60000,
});

class Fetcher extends React.Component {
  updateData = debounce(1000, () => {
    const { refreshInterval } = this.props;

    if (!refreshInterval) {
      clearInterval(this.timeoutRef);
      return;
    }

    this.fetchData(true);
    clearInterval(this.timeoutRef);

    if (this.timeoutRef && refreshInterval) {
      this.timeoutRef = setInterval(() => {
        this.fetchData();
      }, refreshInterval * 1000);
    }
  });

  constructor(props) {
    super(props);
    this.timeoutRef = null;
    this.cancelablePromise = null;
    this.state = {
      loading: true,
      error: null,
      data: undefined,
    };
  }

  componentDidMount() {
    const { refreshInterval } = this.props;

    this.fetchData();

    if (refreshInterval) {
      this.timeoutRef = setInterval(() => {
        this.fetchData();
      }, refreshInterval * 1000);
    }
  }

  componentDidUpdate(prevProps) {
    const { refreshInterval, fetchArgs, manualRefresh } = this.props;

    if (
      !equals(fetchArgs, prevProps.fetchArgs) ||
      !equals(refreshInterval, prevProps.refreshInterval)
    ) {
      this.updateData();
    }

    if (!equals(manualRefresh, prevProps.manualRefresh) && manualRefresh) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    if (this.timeoutRef) clearTimeout(this.timeoutRef);
    if (this.cancelablePromise) this.cancelablePromise.cancel();
  }

  updateState = (state) => {
    this.setState({ ...state });
  };

  fetchData = (argsUpdated) => {
    const { fetchArgs, handleResolution, handleRejection } = this.props;

    if (argsUpdated) {
      this.setState({ loading: true });
    }

    this.cancelablePromise = makeCancelable(
      this.getMeTheNewState(fetchArgs, handleResolution, handleRejection),
    );
    this.cancelablePromise.promise
      .then((newState) => {
        this.setState(newState);
      })
      .catch((err) => {});
  };

  getMeTheNewState = (fetchArgs, handleResolution, handleRejection) => {
    const caller = this.props.caller || Axios;
    const isHeadArray = Array.isArray(fetchArgs[0]);
    const promise = isHeadArray
      ? Promise.all(fetchArgs.map((args) => caller(...args)))
      : caller(...fetchArgs);

    return promise
      .then((response) => {
        const data = isHeadArray ? response.map((r) => r.data) : response.data;
        if (handleResolution) {
          return {
            loading: false,
            data: handleResolution(data),
            error: null,
          };
        }

        return {
          loading: false,
          data,
          error: null,
        };
      })
      .catch((err) => {
        if (handleRejection) {
          return {
            loading: false,
            data: handleRejection(err),
            error: err,
          };
        }

        return {
          loading: false,
          data: undefined,
          error: err,
        };
      });
  };

  render() {
    const { children } = this.props;
    const isFunction = typeof children === "function";
    return isFunction
      ? children(this.state)
      : children && React.cloneElement(children, this.state);
  }
}

Fetcher.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  fetchArgs: PropTypes.arrayOf(PropTypes.any),
  handleRejection: PropTypes.func,
  handleResolution: PropTypes.func,
  refreshInterval: PropTypes.number,
  caller: PropTypes.func,
};

export default Fetcher;

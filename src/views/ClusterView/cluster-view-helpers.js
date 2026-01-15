import * as R from "ramda";
import { createTheme } from "@material-ui/core/styles";

import { longEm, isNothing, applyFormatter, isSomething } from "../../utils";

const theme = createTheme({});

const commonConfigForHealthCharts = {
  chart: {
    zoomType: "x",
  },
  xAxis: { type: "datetime" },
  yAxis: {
    gridLineWidth: 1,
    min: -1,
    max: 2,
    tickInterval: 1,
    labels: {
      formatter() {
        if (this.value === 0 || this.value === 1) {
          return this.value === 0 ? "Unhealthy" : "Healthy";
        }
        return null;
      },
    },
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false,
        symbol: "circle",
        lineWidth: 1,
      },
    },
  },
};

const commonConfigForResourceCharts = (config = {}) => {
  const { max, formatString, isCpu, noPercentage } = config;

  return {
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      gridLineWidth: 1,
      title: { text: null },
      min: 0,
      max: max || 1,
      tickAmount: 6,
      visible: true,
      labels: {
        formatter() {
          return applyFormatter(formatString || "0%", this.value);
        },
      },
    },
    tooltip: {
      shared: true,
      pointFormatter() {
        const { color, y, _y, series } = this;
        const formattedValue = applyFormatter(formatString || "0.0%", y);
        const valueFormat = isCpu ? "0.00a" : "0.0 B";
        const unitFormat = isCpu ? " cores" : "";
        let valueString = ` (${applyFormatter(valueFormat, _y)}${unitFormat})`;
        let formattedValueUnit = "";
        if (noPercentage) {
          formattedValueUnit = unitFormat;
          valueString = "";
        }
        return `<span style="color:${color}">●</span> ${series.name}: <b>${formattedValue}${formattedValueUnit}</b>${valueString}<br/>`;
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          symbol: "circle",
          lineWidth: 1,
        },
      },
    },
  };
};

const nanToZero = (x) => {
  return R.defaultTo(0, parseFloat(x));
};

const maxCpu = R.pipe(
  R.sort(R.descend(R.prop("y"))),
  R.head,
  R.juxt([
    R.pipe(R.propOr(0, "y"), applyFormatter("0.0%")),
    R.pipe(
      R.propOr(0, "_y"),
      applyFormatter("0.00a"),
      nanToZero,
      (x) => `(${x} cores)`,
    ),
  ]),
  R.join(" "),
);

const maxCpuUsage = R.pipe(
  R.sort(R.descend(R.prop("y"))),
  R.head,
  R.propOr(0, "y"),
  applyFormatter("0.00a"),
  nanToZero,
  (x) => `${x} cores`,
);

const currentCpu = R.pipe(
  R.last,
  R.juxt([
    R.pipe(R.propOr(0, "y"), applyFormatter("0.0%")),
    R.pipe(
      R.propOr(0, "_y"),
      applyFormatter("0.00a"),
      nanToZero,
      (x) => `(${x} cores)`,
    ),
  ]),
  R.join(" "),
);

const currentCpuWithTotal = R.pipe(
  R.last,
  R.juxt([
    R.pipe(R.propOr(0, "y"), applyFormatter("0.0%")),
    R.pipe(
      (d) => (R.isNil(d) ? {} : d),
      (d) => ({ ...d, _y: R.pipe(applyFormatter("0.00a"), nanToZero)(d._y) }),
      (d) => (d._y > 0 ? `(${d._y}/${d.total} cores)` : `(${d._y} cores)`),
    ),
  ]),
  R.join(" "),
);

const currentCpuUsage = R.pipe(
  R.last,
  R.propOr(0, "_y"),
  applyFormatter("0.00a"),
  (x) => `CURR ${longEm(x)} cores`,
);

export const dashboardCpuUsage = R.pipe(
  R.toPairs,
  R.last,
  ([ts, value]) => value,
  applyFormatter("0.00a"),
);
export const dashboardMemoryUsage = R.pipe(
  R.toPairs,
  R.last,
  ([ts, value]) => value,
  // applyFormatter("0.0 B")
);

export const dashboardCpuTotal = R.pipe(
  R.toPairs,
  R.last,
  ([ts, value]) => value,
);

export const dashboardMemoryTotal = R.pipe(
  R.toPairs,
  R.last,
  ([ts, value]) => value,
  // applyFormatter("0.0 B")
);

const maxMemory = R.pipe(
  R.sort(R.descend(R.prop("y"))),
  R.head,
  R.juxt([
    R.pipe(R.propOr(0, "y"), applyFormatter("0.0%")),
    R.pipe(R.propOr(0, "_y"), applyFormatter("0.0 B"), (x) => `(${x})`),
  ]),
  R.join(" "),
);

const maxMemoryInBytes = R.pipe(
  R.sort(R.descend(R.prop("y"))),
  R.head,
  R.propOr(0, "y"),
  applyFormatter("0.0 B"),
);

const currentMemory = R.pipe(
  R.last,
  R.juxt([
    R.pipe(R.propOr(0, "y"), applyFormatter("0.0%")),
    R.pipe(R.propOr(0, "_y"), applyFormatter("0.0 B"), (x) => `(${x})`),
  ]),
  R.join(" "),
);

const currentMemoryWithTotal = R.pipe(
  R.last,
  R.juxt([
    R.pipe(R.propOr(0, "y"), applyFormatter("0.0%")),
    R.pipe(
      (d) => (R.isNil(d) ? {} : d),
      (d) => ({
        ...d,
        _y: applyFormatter("0.0 B")(d._y),
        total: applyFormatter("0.0 B")(d.total),
      }),
      (d) => `(${d._y}/${d.total})`,
    ),
  ]),
  R.join(" "),
);

const currentMemoryInBytes = R.pipe(
  R.last,
  R.propOr(0, "_y"),
  applyFormatter("0.0 B"),
  (x) => `CURR ${longEm(x)}`,
);

const currentResourceMessage = (
  usage,
  limit,
  isBestEffort,
  checkMemory = false,
) => {
  try {
    if (isBestEffort || isNothing(limit)) {
      return checkMemory ? currentMemoryInBytes(usage) : currentCpuUsage(usage);
    }

    const { _y: currentUsing } = R.last(usage);
    const [, currentLimit] = R.pipe(R.toPairs, R.last)(limit);
    const gapMeasure = currentUsing > currentLimit ? ">" : "<";
    const change = Math.abs(currentLimit - currentUsing) / currentLimit;
    const percent = applyFormatter("0.0%", change);

    return `CURR ${percent} ${gapMeasure} limit`;
  } catch (error) {
    return `CURR ${longEm()}`;
  }
};

const averageR = R.pipe(R.pluck("y"), R.converge(R.divide, [R.sum, R.length]));

const averageInBytes = R.pipe(averageR, applyFormatter("0.0 B"));

const averageInNum = R.pipe(
  averageR,
  applyFormatter("0.00a"),
  nanToZero,
  (x) => `${x} cores`,
);

const averageArray = R.pipe(
  R.filter(isSomething),
  R.converge(R.divide, [R.sum, R.length]),
);

const averageMemory = R.pipe(
  R.juxt([
    R.pipe(R.pluck("y"), averageArray, applyFormatter("0.0%")),
    R.pipe(
      R.pluck("_y"),
      averageArray,
      applyFormatter("0.0 B"),
      (x) => `(${x})`,
    ),
  ]),
  R.join(" "),
);

const averageCpu = R.pipe(
  R.juxt([
    R.pipe(R.pluck("y"), averageArray, applyFormatter("0.0%")),
    R.pipe(
      R.pluck("_y"),
      averageArray,
      applyFormatter("0.00a"),
      (x) => `(${x} cores)`,
    ),
  ]),
  R.join(" "),
);

export const getTimestamps = R.pipe(
  R.toPairs,
  R.pluck(1),
  R.map(R.keys),
  R.flatten,
  R.uniq,
  R.sort(R.ascend(R.identity)),
);

const getLastPlotPoint = R.pipe(R.prop("data"), R.last, R.prop("y"));

const addMarker = R.when(
  R.propEq("length", 1),
  R.map((datum) => ({
    ...datum,
    marker: {
      enabled: true,
      radius: 4,
    },
  })),
);

function getDataPadding(array = []) {
  const duration = JSON.parse(localStorage.getItem("_duration_")) || {};
  const { seconds = 60 * 60 * 1000 } = duration; // default: 1 hour
  const interval = Math.ceil(seconds / 30);

  if (!array.length) return { padding: seconds, start: Date.now(), interval };

  const { length, 0: _first, [length - 1]: _last } = array;
  const start = _first.x;
  const diff = Math.abs(start - _last.x);
  const padding = Math.abs(seconds - diff);

  return { padding, start, interval };
}

export function normalizeTimeSeries(data) {
  if (!data.length) return data;
  const { padding, start, interval } = getDataPadding(data);
  const isPaddingNeeded = padding > 0 && interval > 0;

  const nullData = [];
  if (isPaddingNeeded) {
    for (let i = interval; i <= padding; i += interval) {
      const secs = start - i;
      nullData.push({
        x: secs,
        y: null,
      });
    }
  }
  const mergedTs = [...nullData.reverse(), ...data];

  return mergedTs;
}

// TODO(Muhammad Kasim): Update method names, they are misleading
export function xformClusterHealthTs(response) {
  const fromData = R.pipe(
    R.map(({ time, reason }) => {
      const isHealthy = !reason;
      return {
        x: new Date(time).valueOf(),
        y: isHealthy ? 1 : 0,
        color: theme.palette.info.light,
        reason,
      };
    }),
    addMarker,
  );
  return {
    ...commonConfigForHealthCharts,
    tooltip: {
      pointFormatter() {
        const { reason, color } = this;
        const getStatusMarkup = () => {
          return reason ? `Unhealthy: <b>${reason}</b>` : "Healthy";
        };
        return `<span style="color:${color}">●</span> ${getStatusMarkup()}<br/>`;
      },
    },
    series: [
      {
        name: "Health",
        color: theme.palette.info.light,
        data: fromData(response),
      },
    ],
  };
}

export function xformClusterCpuTs({ usage, request, total }) {
  let MAX_VALUE = 0;
  const fromTotal = R.pipe(
    R.toPairs,
    R.map(([ts, value]) => {
      const y = Number(value) / Number(total[ts]);
      MAX_VALUE = Math.max(MAX_VALUE, y);
      return {
        y,
        x: Number(ts) * 1000,
        _y: Number(value),
        total: Number(total[ts]),
      };
    }),
    addMarker,
    normalizeTimeSeries,
  );
  const committedSeries = {
    name: "Committed",
    pointStart: 1,
    color: theme.palette.info.main,
    data: fromTotal(request),
  };
  const usageSeries = {
    name: "Usage",
    pointStart: 1,
    color: theme.palette.error.light,
    data: fromTotal(usage),
  };
  const series = {
    ...commonConfigForResourceCharts({
      max: Math.ceil(MAX_VALUE),
      isCpu: true,
    }),
    tooltip: {
      shared: true,
      pointFormatter() {
        const { color, y, _y, series, total } = this;
        const formattedValue = applyFormatter("0.0%", y);
        const unitFormat = " cores";
        const valueString = ` (${applyFormatter(
          "0.00a",
          _y,
        )}/${total})${unitFormat}`;
        return `<span style="color:${color}">●</span> ${series.name}: <b>${formattedValue}</b>${valueString}<br/>`;
      },
    },
    series: [committedSeries, usageSeries],
  };
  const usageSeriesData = usageSeries.data;

  return {
    max: maxCpu(usageSeriesData),
    current: currentCpuWithTotal(usageSeriesData),
    average: averageCpu(usageSeriesData),
    series,
  };
}

export function xformClusterMemoryTs({ usage, request, total }) {
  let MAX_VALUE = 0;
  const fromTotal = R.pipe(
    R.toPairs,
    R.map(([ts, value]) => {
      const y = Number(value) / Number(total[ts]);
      MAX_VALUE = Math.max(MAX_VALUE, y);
      return {
        y,
        x: Number(ts) * 1000,
        _y: Number(value),
        total: Number(total[ts]),
      };
    }),
    addMarker,
    normalizeTimeSeries,
  );
  const committedSeries = {
    name: "Committed",
    pointStart: 1,
    color: theme.palette.info.main,
    data: fromTotal(request),
  };
  const usageSeries = {
    name: "Usage",
    pointStart: 1,
    color: theme.palette.error.light,
    data: fromTotal(usage),
  };
  const series = {
    ...commonConfigForResourceCharts({ max: Math.ceil(MAX_VALUE) }),
    tooltip: {
      shared: true,
      pointFormatter() {
        const { color, y, _y, series, total } = this;
        const formattedValue = applyFormatter("0.0%", y);
        const valueFormat = "0.0 B";
        const valueString = ` (${applyFormatter(
          valueFormat,
          _y,
        )}/${applyFormatter(valueFormat, total)})`;
        return `<span style="color:${color}">●</span> ${series.name}: <b>${formattedValue}</b>${valueString}<br/>`;
      },
    },
    series: [committedSeries, usageSeries],
  };
  const usageSeriesData = usageSeries.data;
  return {
    max: maxMemory(usageSeriesData),
    current: currentMemoryWithTotal(usageSeriesData),
    average: averageMemory(usageSeriesData),
    series,
  };
}

export function xformClusterStorageTs({ usage, total }) {
  let MAX_VALUE = 0;
  const fromTotal = R.pipe(
    R.toPairs,
    R.map(([ts, value]) => {
      const y = Number(value) / Number(total[ts]);
      MAX_VALUE = Math.max(MAX_VALUE, y);
      return {
        y,
        x: Number(ts) * 1000,
        _y: Number(value),
        total: Number(total[ts]),
      };
    }),
    addMarker,
    normalizeTimeSeries,
  );
  const usageSeries = {
    name: "Usage",
    pointStart: 1,
    color: theme.palette.info.light,
    data: fromTotal(usage),
  };
  const series = {
    ...commonConfigForResourceCharts({ max: Math.ceil(MAX_VALUE) }),
    tooltip: {
      shared: true,
      pointFormatter() {
        const { color, y, _y, series, total } = this;
        const formattedValue = applyFormatter("0.0%", y);
        const valueFormat = "0.0 B";
        const valueString = ` (${applyFormatter(
          valueFormat,
          _y,
        )}/${applyFormatter(valueFormat, total)})`;
        return `<span style="color:${color}">●</span> ${series.name}: <b>${formattedValue}</b>${valueString}<br/>`;
      },
    },
    series: [usageSeries],
  };
  const usageSeriesData = usageSeries.data;
  return {
    max: maxMemory(usageSeriesData),
    current: currentMemoryWithTotal(usageSeriesData),
    average: averageMemory(usageSeriesData),
    series,
  };
}

export function xformNodeHealthCountTs(response) {
  const nodes = R.keys(response);
  const timestamps = getTimestamps(response);
  const isNodeHealthy = (node, ts) => {
    if (!response[node][ts]) return -1;
    return R.equals(["Ready"], response[node][ts]);
  };
  const readySeries = {
    name: "Ready",
    pointStart: 1,
    color: theme.palette.info.light,
    data: R.pipe(
      R.map((ts) => {
        return {
          x: Number(ts) * 1000,
          y: nodes.filter((n) => {
            const healthy = isNodeHealthy(n, ts);
            return healthy === -1 ? false : healthy;
          }).length,
        };
      }),
      addMarker,
      normalizeTimeSeries,
    )(timestamps),
  };
  const notReadySeries = {
    name: "Not Ready",
    pointStart: 1,
    color: theme.palette.error.light,
    data: R.pipe(
      R.map((ts) => {
        const notReadyNodes = nodes.filter((n) => {
          const healthy = isNodeHealthy(n, ts);
          return healthy === -1 ? false : !healthy;
        });
        return {
          x: Number(ts) * 1000,
          y: notReadyNodes.length,
          nodes: notReadyNodes,
        };
      }),
      addMarker,
      normalizeTimeSeries,
    )(timestamps),
  };
  const series = {
    xAxis: { type: "datetime" },
    yAxis: {
      gridLineWidth: 1,
      min: 0,
      tickInterval: 1,
      tickAmount: 6,
      labels: {
        format: "{value:.0f}",
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      pointFormatter() {
        const { color, y, nodes = [], series } = this;
        if (series.name === "Not Ready" && nodes.length) {
          const nodesMarkup = nodes
            .map((n) => `<span>${n}</span>`)
            .join("<br/>");
          return `<span style="color:${color}">●</span> ${series.name}: <b>${y}</b><hr style="margin:4px 0px"/>${nodesMarkup}`;
        }
        return `<span style="color:${color}">●</span> ${series.name}: <b>${y}</b><br/>`;
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          symbol: "circle",
          lineWidth: 1,
        },
      },
    },
    series: [readySeries, notReadySeries],
  };
  return {
    ready: getLastPlotPoint(readySeries),
    notReady: getLastPlotPoint(notReadySeries),
    series,
  };
}

export function xformWorkloadHealthCountTs(response) {
  const workloads = R.keys(response);
  const timestamps = getTimestamps(response);
  const isWorkloadHealthy = (wl, ts) => {
    if (R.isNil(response[wl][ts])) return -1;
    return response[wl][ts] === 0;
  };
  const readySeries = {
    name: "Ready",
    pointStart: 1,
    color: theme.palette.info.light,
    data: R.pipe(
      R.map((ts) => {
        return {
          x: Number(ts) * 1000,
          y: workloads.filter((wl) => {
            const healthy = isWorkloadHealthy(wl, ts);
            return healthy === -1 ? false : healthy;
          }).length,
        };
      }),
      addMarker,
      normalizeTimeSeries,
    )(timestamps),
  };
  const notReadySeries = {
    name: "Not Ready",
    pointStart: 1,
    color: theme.palette.error.light,
    data: R.pipe(
      R.map((ts) => {
        const notReadyWorkloads = workloads.filter((wl) => {
          const healthy = isWorkloadHealthy(wl, ts);
          return healthy === -1 ? false : !healthy;
        });
        return {
          x: Number(ts) * 1000,
          y: notReadyWorkloads.length,
          workloads: notReadyWorkloads,
        };
      }),
      addMarker,
      normalizeTimeSeries,
    )(timestamps),
  };
  const series = {
    xAxis: { type: "datetime" },
    yAxis: {
      gridLineWidth: 1,
      min: 0,
      tickInterval: 1,
      tickAmount: 6,
      labels: {
        format: "{value:.0f}",
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      outside: true,
      pointFormatter() {
        const { color, y, workloads = [], series } = this;
        if (series.name === "Not Ready" && workloads.length) {
          const workloadsMarkup = workloads
            .map((n) => `<span>${n}</span>`)
            .join("<br/>");
          return `<span style="color:${color}">●</span> ${series.name}: <b>${y}</b><hr style="margin:4px 0px"/>${workloadsMarkup}`;
        }
        return `<span style="color:${color}">●</span> ${series.name}: <b>${y}</b><br/>`;
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          symbol: "circle",
          lineWidth: 1,
        },
      },
    },
    series: [readySeries, notReadySeries],
  };
  return {
    ready: getLastPlotPoint(readySeries),
    notReady: getLastPlotPoint(notReadySeries),
    series,
  };
}

export function xformPodHealthCountTs(response) {
  const pods = R.keys(response);
  const timestamps = getTimestamps(response);
  const isPodHealthyAtTs = (pod, ts) => {
    if (!response[pod][ts]) return -1;
    return R.path([pod, ts, "healthy"], response);
  };

  const runningSeries = {
    name: "Running",
    pointStart: 1,
    color: theme.palette.info.light,
    data: R.pipe(
      R.map((ts) => {
        return {
          x: Number(ts) * 1000,
          y: pods.filter((p) => {
            const healthy = isPodHealthyAtTs(p, ts);
            return healthy === -1 ? false : healthy;
          }).length,
        };
      }),
      addMarker,
      normalizeTimeSeries,
    )(timestamps),
  };
  const errorSeries = {
    name: "Error",
    pointStart: 1,
    color: theme.palette.error.light,
    data: R.pipe(
      R.map((ts) => {
        const errorPods = pods.filter((p) => {
          const healthy = isPodHealthyAtTs(p, ts);
          return healthy === -1 ? false : !healthy;
        });
        return {
          x: Number(ts) * 1000,
          y: errorPods.length,
          pods: errorPods,
        };
      }),
      addMarker,
      normalizeTimeSeries,
    )(timestamps),
  };
  const series = {
    xAxis: { type: "datetime" },
    yAxis: {
      gridLineWidth: 1,
      min: 0,
      tickAmount: 6,
      labels: {
        format: "{value:.0f}",
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      outside: true,
      pointFormatter() {
        const { color, y, pods = [], series } = this;
        if (series.name === "Error" && pods.length) {
          const podsMarkup = pods.map((n) => `<span>${n}</span>`).join("<br/>");
          return `<span style="color:${color}">●</span> ${series.name}: <b>${y}</b><hr style="margin:4px 0px"/>${podsMarkup}`;
        }
        return `<span style="color:${color}">●</span> ${series.name}: <b>${y}</b><br/>`;
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          symbol: "circle",
          lineWidth: 1,
        },
      },
    },
    series: [runningSeries, errorSeries],
  };
  return {
    running: getLastPlotPoint(runningSeries),
    error: getLastPlotPoint(errorSeries),
    series,
  };
}

export function xformNodeHealthTs(name) {
  return function (response) {
    const data = R.propOr({}, name, response);
    const fromData = R.pipe(
      R.toPairs,
      R.map(([ts, condition]) => {
        const isHealthy = R.equals(["Ready"], condition);
        return {
          x: Number(ts) * 1000,
          y: isHealthy ? 1 : 0,
          color: theme.palette.info.light,
          condition: condition.join(", "),
          isHealthy,
        };
      }),
      addMarker,
      normalizeTimeSeries,
    );
    return {
      ...commonConfigForHealthCharts,
      tooltip: {
        pointFormatter() {
          const { condition, isHealthy, color } = this;
          const getStatusMarkup = () => {
            return !isHealthy ? `Unhealthy: <b>${condition}</b>` : "Healthy";
          };
          return `<span style="color:${color}">●</span> ${getStatusMarkup()}<br/>`;
        },
      },
      series: [
        {
          name: "Health",
          color: theme.palette.info.light,
          data: fromData(data),
        },
      ],
    };
  };
}

export function xformPodCpuTs({ qos }) {
  return function ({ usage, request, limit }) {
    let MAX_VALUE = 0;
    const sameLengthResp = R.keys(request).length === R.keys(usage).length;
    const isBestEffort = qos === "BestEffort" || !sameLengthResp;
    const fromRequest = R.pipe(
      R.toPairs,
      R.map(([ts, value]) => {
        const y = isBestEffort
          ? Number(value)
          : Number(value) / Number(request[ts]);
        MAX_VALUE = Math.max(MAX_VALUE, y);
        return {
          y,
          x: Number(ts) * 1000,
          _y: Number(value),
          request: Number(request[ts]),
        };
      }),
      addMarker,
      normalizeTimeSeries,
    );
    const formatString = isBestEffort ? "0.00a" : "0%";
    const usageSeries = {
      name: "Usage",
      pointStart: 1,
      color: theme.palette.info.light,
      data: fromRequest(usage),
    };
    const series = {
      ...commonConfigForResourceCharts({
        max: Math.ceil(MAX_VALUE),
        formatString,
        isCpu: true,
        noPercentage: isBestEffort,
      }),
      series: [usageSeries],
    };
    const usageSeriesData = usageSeries.data;
    const current = currentResourceMessage(
      usageSeriesData,
      limit,
      isBestEffort,
      false,
    );
    const max = isBestEffort
      ? maxCpuUsage(usageSeriesData)
      : maxCpu(usageSeriesData);
    const averageMessage = isBestEffort
      ? averageInNum(usageSeriesData)
      : averageCpu(usageSeriesData);
    return {
      max,
      current,
      average: averageMessage,
      series,
    };
  };
}

export function xformContainerCpuTs(isCpu, qos) {
  return function (res) {
    const { usage, request, limit } = res;
    // console.log("usage is", res);
    let MAX_VALUE = 0;
    const sameLengthResp = R.keys(request).length === R.keys(usage).length;
    const isBestEffort = qos === "BestEffort" || !sameLengthResp;
    const fromRequest = R.pipe(
      R.toPairs,
      R.map(([ts, value]) => {
        const y = isBestEffort
          ? Number(value)
          : Number(value) / Number(request[ts]);
        MAX_VALUE = Math.max(MAX_VALUE, y);
        return {
          y,
          x: Number(ts) * 1000,
          _y: Number(value),
          request: Number(request[ts]),
        };
      }),
      addMarker,
      normalizeTimeSeries,
    );
    const formatStringCpu = isBestEffort ? "0.00a" : "0%";
    const formatStringMem = isBestEffort ? "0.0 B" : "0%";
    const formatString = isCpu ? formatStringCpu : formatStringMem;
    const usageSeries = {
      name: "Usage",
      pointStart: 1,
      color: theme.palette.info.light,
      data: fromRequest(usage),
    };
    const series = {
      ...commonConfigForResourceCharts({
        max: Math.ceil(MAX_VALUE),
        formatString,
        isCpu,
        noPercentage: isBestEffort,
      }),
      series: [usageSeries],
    };
    const usageSeriesData = usageSeries.data;
    const current = currentResourceMessage(
      usageSeriesData,
      limit,
      isBestEffort,
      !isCpu,
    );
    const max = isBestEffort
      ? isCpu
        ? maxCpuUsage(usageSeriesData)
        : maxMemoryInBytes(usageSeriesData)
      : isCpu
        ? maxCpu(usageSeriesData)
        : maxMemory(usageSeriesData);
    const averageMessage = isBestEffort
      ? isCpu
        ? averageInNum(usageSeriesData)
        : averageInBytes(usageSeriesData)
      : isCpu
        ? averageCpu(usageSeriesData)
        : averageMemory(usageSeriesData);

    return {
      max,
      current,
      average: averageMessage,
      series,
    };
  };
}

export function xformPodMemoryTs({ qos }) {
  return function ({ usage, request, limit }) {
    let MAX_VALUE = 0;
    const sameLengthResp = R.keys(request).length === R.keys(usage).length;
    const isBestEffort = qos === "BestEffort" || !sameLengthResp;
    const fromRequest = R.pipe(
      R.toPairs,
      R.map(([ts, value]) => {
        const y = isBestEffort
          ? Number(value)
          : Number(value) / Number(request[ts]);
        MAX_VALUE = Math.max(MAX_VALUE, y);
        return {
          y,
          x: Number(ts) * 1000,
          _y: Number(value),
          request: Number(request[ts]),
        };
      }),
      addMarker,
      normalizeTimeSeries,
    );
    const formatString = isBestEffort ? "0.0 B" : "0%";
    const usageSeries = {
      name: "Usage",
      pointStart: 1,
      color: theme.palette.info.light,
      data: fromRequest(usage),
    };
    const series = {
      ...commonConfigForResourceCharts({
        max: Math.ceil(MAX_VALUE),
        formatString,
        noPercentage: isBestEffort,
      }),
      series: [usageSeries],
    };
    const usageSeriesData = usageSeries.data;
    const current = currentResourceMessage(
      usageSeriesData,
      limit,
      isBestEffort,
      true,
    );
    const max = isBestEffort
      ? maxMemoryInBytes(usageSeriesData)
      : maxMemory(usageSeriesData);
    const averageMessage = isBestEffort
      ? averageInBytes(usageSeriesData)
      : averageMemory(usageSeriesData);

    return {
      max,
      current,
      average: averageMessage,
      series,
    };
  };
}

export function xformPodHealthTs(name) {
  return function (response) {
    const data = R.propOr({}, name, response);
    const fromData = R.pipe(
      R.toPairs,
      R.map(([ts, phaseData]) => {
        const { containerReasons, phase } = phaseData;
        const isHealthy =
          (phase === "Running" || phase === "Succeeded") && !containerReasons;
        return {
          x: Number(ts) * 1000,
          y: isHealthy ? 1 : 0,
          color: theme.palette.info.light,
          phaseData,
        };
      }),
      addMarker,
      normalizeTimeSeries,
    );
    return {
      ...commonConfigForHealthCharts,
      tooltip: {
        pointFormatter() {
          const { phaseData, color, y } = this;
          const getStatusMarkup = () => {
            const { containerReasons, phase } = phaseData;
            const phaseText = containerReasons
              ? R.values(containerReasons).join(", ")
              : phase;
            return y !== 1 ? `Unhealthy: <b>${phaseText}</b>` : "Healthy";
          };
          return `<span style="color:${color}">●</span> ${getStatusMarkup()}<br/>`;
        },
      },
      series: [
        {
          name: "Health",
          color: theme.palette.info.light,
          data: fromData(data),
        },
      ],
    };
  };
}

export function xformContainerHealthTs(name) {
  return function (response) {
    const data = R.propOr({}, name, response);
    const fromData = R.pipe(
      R.toPairs,
      R.map(([ts, statusData]) => {
        const { healthy } = statusData;
        // const isHealthy =
        //   (phase === "Running" || phase === "Succeeded") && !containerReasons;
        return {
          x: Number(ts) * 1000,
          // y: isHealthy ? 1 : 0,
          y: healthy ? 1 : 0,
          color: theme.palette.info.light,
          statusData,
        };
      }),
      addMarker,
      normalizeTimeSeries,
    );
    return {
      ...commonConfigForHealthCharts,
      tooltip: {
        pointFormatter() {
          const { statusData, color, y } = this;
          const getStatusMarkup = () => {
            const { containerReasons, ready } = statusData;
            const statusText = containerReasons
              ? R.values(containerReasons).join(", ")
              : "";
            return y !== 1 ? `Unhealthy: <b>${statusText}</b>` : "Healthy";
          };
          return `<span style="color:${color}">●</span> ${getStatusMarkup()}<br/>`;
        },
      },
      series: [
        {
          name: "Health",
          color: theme.palette.info.light,
          data: fromData(data),
        },
      ],
    };
  };
}

export function xformPodRestartTs(response) {
  return {
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      gridLineWidth: 1,
      // min: 0,
      tickInterval: 1,
      tickAmount: 6,
      labels: {
        format: "{value:.0f}",
      },
    },
    tooltip: {
      pointFormat:
        '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y:.0f}</b><br/>',
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          symbol: "circle",
          lineWidth: 1,
        },
      },
    },
    series: [
      {
        name: "Restarts",
        pointStart: 1,
        color: theme.palette.info.light,
        data: R.pipe(
          R.toPairs,
          R.map(([ts, value]) => ({
            x: Number(ts) * 1000,
            y: Number(value),
          })),
          addMarker,
          normalizeTimeSeries,
        )(response),
      },
    ],
  };
}

const toIndividualKeys = R.pipe(R.toPairs, R.map(R.pipe(R.of, R.fromPairs)));

export const getFormattedResponse = R.pipe(
  R.map((d) => {
    const match = d.metric.rc_edgeid.split(".", 1);
    const edgeIdShort = match[0];

    return {
      key: edgeIdShort,
      count: R.pipe(R.last, R.last)(d.values),
    };
  }),
);

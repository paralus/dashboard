import React from "react";
import { merge } from "highcharts";
import ReactHighcharts from "../ReactHighcharts";
import BASE_CONFIG from "./hc-base-config";

const AREA_SPARKLINE_CONFIG = {
  chart: {
    backgroundColor: null,
    borderWidth: 0,
    type: "area",
    margin: [2, 0, 2, 0],
    width: 120,
    height: 20,
    skipClone: true,
    zoomType: undefined,
    style: {
      overflow: "visible",
    },
  },
  xAxis: {
    labels: {
      enabled: false,
    },
    title: {
      text: null,
    },
    startOnTick: false,
    endOnTick: false,
    tickPositions: [],
  },
  yAxis: {
    endOnTick: false,
    startOnTick: false,
    labels: {
      enabled: false,
    },
    title: {
      text: null,
    },
    tickPositions: [0],
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    hideDelay: 0,
    outside: true,
    shared: true,
  },
  plotOptions: {
    series: {
      animation: false,
      lineWidth: 1,
      shadow: false,
      states: {
        hover: {
          lineWidth: 1,
        },
      },
      marker: {
        radius: 1,
        states: {
          hover: {
            radius: 2,
          },
        },
      },
      fillOpacity: 0.25,
    },
  },
};

export function AreaSparklineChart({ config, ...rest }) {
  const mergedConfig = merge(merge(BASE_CONFIG, AREA_SPARKLINE_CONFIG), config);
  return <ReactHighcharts config={mergedConfig} {...rest} />;
}

import React from "react";
import { merge } from "highcharts";
import ReactHighcharts from "../ReactHighcharts";
import BASE_CONFIG from "./hc-base-config";

const TIMELINE_CHART_CONFIG = {
  chart: { type: "xrange" },
  xAxis: { type: "datetime" },
  yAxis: {
    visible: false,
    min: 0,
    max: 2,
  },
  plotOptions: {
    series: {
      borderRadius: 0,
      pointWidth: 20,
      pointPadding: 0,
      groupPadding: 0,
      borderWidth: 0,
      shadow: false,
    },
  },
};

/* This is basically an XRange chart. For details about its configurations, see Highcharts XRange Chart. */
export function TimelineChart({ config, ...rest }) {
  const mergedConfig = merge(merge(BASE_CONFIG, TIMELINE_CHART_CONFIG), config);
  return <ReactHighcharts config={mergedConfig} {...rest} />;
}

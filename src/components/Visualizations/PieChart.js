import React from "react";
import { merge } from "highcharts";
import ReactHighcharts from "../ReactHighcharts";
import BASE_CONFIG from "./hc-base-config";

const DONUT_SERIES_CONFIG = {
  size: "130%",
  innerSize: "80%",
  dataLabels: {
    enabled: false,
  },
};

const DONUT_CHART_CONFIG = (config = {}) => {
  const updatedSeries = (config.series || []).map((s) =>
    merge(DONUT_SERIES_CONFIG, s)
  );
  return merge(
    {
      chart: {
        type: "pie",
      },
      plotOptions: {
        pie: {
          shadow: false,
        },
      },
    },
    { ...config, series: updatedSeries }
  );
};

export function DonutChart({ config, ...rest }) {
  const updateConfig = DONUT_CHART_CONFIG(config);
  const mergedConfig = merge(BASE_CONFIG, updateConfig);
  return <ReactHighcharts config={mergedConfig} {...rest} />;
}

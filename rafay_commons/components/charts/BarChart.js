import React from "react";
import { merge } from "highcharts";
import ReactHighChart from "./highcharts/ReactHighChart";

const BAR_OPTIONS = {
  chart: {
    type: "column"
  },
  plotOptions: {
    series: {
      pointWidth: 40
    }
  }
  // tooltip: {
  //   pointFormat: "{series.name}: <b>{point.y}</b>"
  // }
};

const BarChart = ({ options }) => {
  const mergedOptions = merge(BAR_OPTIONS, options);
  return <ReactHighChart options={mergedOptions} />;
};

export default BarChart;

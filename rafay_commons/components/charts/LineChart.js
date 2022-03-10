import React from "react";
import { merge } from "highcharts";
import ReactHighChart from "./highcharts/ReactHighChart";

const LINE_OPTIONS = {
  chart: {
    type: "line"
  },
  tooltip: {
    useHTML: true,
    // headerFormat: "{series.name}<table>",
    pointFormat:
      "<span style='height: 5px; width: 5px; background-color:{series.color}; border-radius: 50%; display: inline-block;'></span> {series.name}: <b>{point.y}</b><br>"
    // footerFormat: "</table>"
  },
  legend: {
    symbolWidth: 20,
    symbolHeight: 20
  }
};

const LineChart = ({ options }) => {
  const mergedOptions = merge(LINE_OPTIONS, options);
  return <ReactHighChart options={mergedOptions} />;
};

export default LineChart;

import React from "react";
import { merge } from "highcharts";
import ReactHighChart from "./highcharts/ReactHighChart";
import Highcharts from "highcharts";

const pieColors = (function() {
  let colors = [],
    base = "#427dcf",
    i;

  for (i = 0; i < 1; i += 0.1) {
    // Start out with a darkened base color, and end
    // up with a much brighter color
    colors.push(
      Highcharts.color(base)
        .brighten(i)
        .get()
    );
  }
  return colors;
})();

const PIE_OPTIONS = {
  chart: {
    // plotShadow: false,
    type: "pie"
  },
  tooltip: {
    useHTML: true,
    headerFormat: "<table>",
    pointFormat:
      "<tr><td>{point.name}: </td>" +
      "<td><b>{point.percentage:.1f} % ({point.y})</b></td></tr>",
    footerFormat: "</table>"
  },
  plotOptions: {
    pie: {
      colors: pieColors,
      size: "90%",
      dataLabels: {
        distance: 6,
        enabled: true,
        format: "<b>{point.name}</b>: {point.percentage:.1f} %"
      },
      showInLegend: true
    }
  }
};

const PieChart = ({ options }) => {
  const mergedOptions = merge(PIE_OPTIONS, options);
  return <ReactHighChart options={mergedOptions} />;
};

export default PieChart;

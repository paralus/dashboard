import React from "react";
import { merge } from "highcharts";
import ReactHighChart from "./highcharts/ReactHighChart";

const GUAGE_COLORS = {
  normal: "#009688",
  warning: "yellow",
  danger: "#DF5353"
};
const GAUGE_OPTIONS = {
  chart: {
    type: "solidgauge"
  },

  title: null,

  pane: {
    center: ["50%", "65%"],
    size: "110%",
    startAngle: -90,
    endAngle: 90,
    background: {
      backgroundColor: "#EEE",
      innerRadius: "65%",
      outerRadius: "90%",
      shape: "arc"
    }
  },

  exporting: {
    enabled: false
  },

  tooltip: {
    enabled: false
  },

  // the value axis
  yAxis: {
    stops: [
      [0.65, GUAGE_COLORS.normal],
      [0.9, GUAGE_COLORS.warning],
      [1, GUAGE_COLORS.danger]
    ],
    plotBands: [
      { from: 0, to: 65, color: GUAGE_COLORS.normal, thickness: "5%" },
      { from: 65, to: 90, color: GUAGE_COLORS.warning, thickness: "5%" },
      { from: 90, to: 100, color: GUAGE_COLORS.danger, thickness: "5%" }
    ],
    lineWidth: 0,
    tickWidth: 0,
    minorTickInterval: null,
    tickAmount: 2,
    title: {
      y: -70
    },
    labels: {
      y: 16
    }
  },

  plotOptions: {
    solidgauge: {
      innerRadius: "65%",
      radius: 90,
      dataLabels: {
        y: -30,
        borderWidth: 0,
        useHTML: true
      }
    }
  }
};

const GaugeChart = ({ options, noMergeOptions }) => {
  const mergedOptions = noMergeOptions
    ? options
    : merge(GAUGE_OPTIONS, options);
  return <ReactHighChart options={mergedOptions} />;
};

export default GaugeChart;

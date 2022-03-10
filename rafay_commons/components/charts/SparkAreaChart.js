/* eslint-disable object-shorthand */
import React from "react";
import Highcharts, { merge } from "highcharts";
// import Highcharts from "highcharts";
import ReactHighChart from "./highcharts/ReactHighChart";
import { getFormatedTrendData } from "../../utils/helpers";

const defaultOptions = {
  chart: {
    backgroundColor: null,
    borderWidth: 0,
    type: "area",
    margin: [0, -3, 0, -3],
    height: 80,
    style: {
      overflow: "visible"
    },

    // small optimalization, saves 1-2 ms each sparkline
    skipClone: true
  },
  title: {
    text: ""
  },
  credits: {
    enabled: false
  },
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      millisecond: "%H:%M:%S.%L",
      second: "%H:%M:%S",
      minute: "%H:%M",
      hour: "%H:%M",
      day: "%e. %b",
      week: "%e. %b",
      month: "%b '%y",
      year: "%Y"
    },
    title: {
      text: null
    },
    startOnTick: false,
    endOnTick: false,
    tickPositions: [],
    visible: false
  },
  yAxis: {
    endOnTick: false,
    startOnTick: false,
    labels: {
      enabled: false
    },
    title: {
      text: null
    },
    tickPositions: [0]
  },
  legend: {
    enabled: false
  },
  noData: {
    style: {
      display: "none"
    }
  },
  // tooltip: {
  //   backgroundColor: "white",
  //   borderWidth: 1,
  //   hideDelay: 0,
  //   shared: true,
  //   padding: 8,
  //   borderColor: "silver",
  //   borderRadius: 3,
  //   positioner: function(w, h, point) {
  //     return { x: point.plotX - w / 2, y: point.plotY - h };
  //   }
  // },

  tooltip: {
    useHTML: true,
    formatter: function() {
      return `<div>${Highcharts.dateFormat(
        "%e  %b  %Y",
        new Date(this.x)
      )}</div>
        <span style='height: 5px; width: 5px; background-color:${
          this.series.color
        }; border-radius: 50%; display: inline-block;'></span> ${
        this.series.name
      }: <b>${this.point.y}</b><br>`;
    }
    // headerFormat: `<div>{point.x}</div>`,
    // pointFormat:
    // "<span style='height: 5px; width: 5px; background-color:{series.color}; border-radius: 50%; display: inline-block;'></span> {series.name}: <b>{point.y}</b><br>"
    // footerFormat: "</table>"
  },
  plotOptions: {
    series: {
      animation: false,
      lineWidth: 1,
      shadow: false,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      marker: {
        enabled: false,
        radius: 1,
        states: {
          hover: {
            radius: 2
          }
        }
      },
      fillOpacity: 0.25
    },
    column: {
      negativeColor: "#910000",
      borderColor: "silver"
    }
  }
};

const SparkAreaChart = ({ data, title, color, isSkipFormatting }) => {
  const trendData = isSkipFormatting ? {} : getFormatedTrendData(data || []);
  const formattedOptions = data
    ? {
        plotOptions: {
          area: {
            pointInterval: 86400000, // 24 hrs
            pointStart: Date.parse(trendData?.min)
          },
          series: {
            marker: {
              enabledThreshold: 1
            }
          }
        },
        series: [
          {
            name: title,
            data: trendData?.seriesData,
            // pointStart: 1,
            color
          }
        ]
      }
    : {};
  const options = isSkipFormatting ? data : formattedOptions;
  const mergedOptions = merge(defaultOptions, options);

  return <ReactHighChart options={mergedOptions} />;
};

export default SparkAreaChart;

import React from "react";
import * as R from "ramda";
import Highcharts, { merge } from "highcharts";
import ReactHighcharts from "../ReactHighcharts";
import BASE_CONFIG from "./hc-base-config";

const FIXED_GUAGE_PANES = [
  {
    outerRadius: "112%",
    innerRadius: "88%",
    borderWidth: 0,
  },
  {
    outerRadius: "85%",
    innerRadius: "61%",
    borderWidth: 0,
  },
];

const FIXED_GUAGE_SERIES = [
  {
    data: [
      {
        radius: "112%",
        innerRadius: "88%",
      },
    ],
  },
  {
    data: [
      {
        radius: "85%",
        innerRadius: "61%",
      },
    ],
  },
];

const ACTIVITY_GUAGE_CHART_CONFIG = (config = {}) => {
  const mergeBackgrounds = R.pipe(R.propOr([], "series"), R.take(2), (list) => {
    return list.map((i, idx) => {
      const fixedPane = FIXED_GUAGE_PANES[idx];
      const color = R.pathOr(
        Highcharts.getOptions().colors[idx],
        ["data", 0, "color"],
        i
      );
      const backgroundColor = Highcharts.color(color).setOpacity(0.3).get();
      return R.assoc("backgroundColor", backgroundColor, fixedPane);
    });
  });
  const mergeSeries = R.pipe(R.propOr([], "series"), R.take(2), (list) => {
    return list.map((i, idx) => {
      const fixedData = FIXED_GUAGE_SERIES[idx].data;
      const data = R.when(
        R.isEmpty,
        R.always([{}]),
        R.take(1, R.propOr([], "data", i))
      );
      const zippedData = R.zipWith((l, r) => ({ ...l, ...r }), data, fixedData);
      return R.assoc("data", zippedData, i);
    });
  });
  const mergedWithoutSeries = merge(
    {
      chart: {
        type: "solidgauge",
      },
      pane: {
        startAngle: 0,
        endAngle: 360,
        background: mergeBackgrounds(config),
      },
      yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: [],
      },
      tooltip: {
        borderWidth: 0,
        backgroundColor: "none",
        shadow: false,
        style: {
          fontSize: "12px",
        },
        valueSuffix: "%",
        pointFormat:
          '{series.name}<br><span style="font-size:1.2em; color: {point.color}; font-weight: bold">{point.y:.0f}</span>',
        positioner(labelWidth) {
          return {
            x: (this.chart.chartWidth - labelWidth) / 2,
            y: this.chart.plotHeight / 2 - 15,
          };
        },
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            enabled: false,
          },
          linecap: "round",
          stickyTracking: false,
          rounded: true,
        },
      },
      series: mergeSeries(config),
    },
    config
  );

  return { ...mergedWithoutSeries, series: mergeSeries(config) };
};

/* This is basically an XRange chart. For details about its configurations, see Highcharts XRange Chart. */
export function ActivityGuageChart({ config, ...rest }) {
  const updatedConfig = ACTIVITY_GUAGE_CHART_CONFIG(config);
  const mergedConfig = merge(BASE_CONFIG, updatedConfig);
  return <ReactHighcharts config={mergedConfig} {...rest} />;
}

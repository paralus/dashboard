import { merge } from "highcharts";
import React from "react";
import ReactHighcharts from "../ReactHighcharts";
import BASE_CONFIG from "./hc-base-config";

const STACKED_COLUMN_CONFIG = {};

export function StackedColumChart({ config, ...rest }) {
  console.log("BAR", config);
  const mergedConfig = merge(merge(BASE_CONFIG, STACKED_COLUMN_CONFIG), config);
  return <ReactHighcharts config={mergedConfig} {...rest} />;
}

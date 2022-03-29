import React from "react";
import { merge } from "highcharts";
import ReactHighcharts from "../ReactHighcharts";
import BASE_CONFIG from "./hc-base-config";

const LINE_CONFIG = {};

export function LineChart({ config, ...rest }) {
  const mergedConfig = merge(merge(BASE_CONFIG, LINE_CONFIG), config);
  return <ReactHighcharts config={mergedConfig} {...rest} />;
}
